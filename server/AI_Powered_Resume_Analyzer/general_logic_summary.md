# Resume Analyzer - General Logic Summary

This document outlines the core logic flow and architecture for the AI Powered Resume Analyzer.

## Architecture & Project Structure

The project is split into two main applications:
1.  **`authentication`**: Handles User Registration, Login, and JWT Token issuance.
2.  **`analyzer`**: Handles Resume Upload, AI Analysis, and History tracking.

```
analyzer/
├── api/
│   ├── serializers.py       # Input validation (File, Job Description/Title)
│   └── views.py             # API Endpoints (ResumeAnalyzeView)
├── services/
│   ├── extractors.py        # Text extraction (PDF/DOCX)
│   ├── gemini_client.py     # AI analysis & Prompt engineering
│   ├── score_engine.py      # ATS Score calculation
│   └── scraper.py           # Job Description URL scraping
├── models.py                # Database models (ResumeAnalysis)
└── urls.py                  # Routing
```

## Core Workflow

1.  **Authentication (JWT)**:
    - User logs in via `/auth/signin/`.
    - Server verifies credentials (MongoDB) and returns a **JWT Token**.
    - For protected endpoints (like History or saving analysis), the client MUST send this token in the `Authorization: Bearer <token>` header.

2.  **Resume Analysis**:
    - **Endpoint**: `/api/analyze/` (POST)
    - **Input**:
        - `resume`: File (PDF/DOCX)
        - `job_description`: Text (Required). *See Smart Detection below.*
        - `job_title`: Text (Optional).
    - **Smart Detection**:
        - If the `job_description` input is short (< 200 chars), the system automatically treats it as a **Job Title**.
        - The AI prompt is adjusted to "infer requirements" for that role instead of validation against a full JD.
    - **Process**:
        1.  **Link Scraping**: If `job_description` is a URL, `scraper.py` fetches the text content.
        2.  **Extraction**: `extractors.py` reads text from the uploaded file.
        3.  **Analysis**: `gemini_client.py` sends the resume text + JD/Title to Google Gemini 1.5 Flash.
        3.  **Scoring**: `score_engine.py` calculates a match percentage based on skills found vs. missing.
    - **Persistence**:
        - If a valid JWT is present, the analysis result is saved to the `ResumeAnalysis` table, linked by the user's ID.

3.  **User History**:
    - **Endpoint**: `/auth/history/` (GET)
    - **Logic**: Verifies the JWT, extracts the `user_id`, and queries the database for all past reports belonging to that user.

## Data Storage

- **Users**: Stored in MongoDB (via `djongo` / direct `pymongo` in Auth app).
- **Resume Reports**: Stored in MongoDB (via `ResumeAnalysisModel`).
- **Files**: Processed in-memory. No permanent storage on disk.

## Deployment

- **Platform**: Render (or similar PaaS)
- **Server**: `gunicorn`
- **Static Files**: Served via `whitenoise`
- **Build Script**: `build.sh` (Installs reqs, collects static files, migrates)
- **Database Access**: Ensure MongoDB Atlas IP Whitelist includes `0.0.0.0/0` (or Render static IP) for connection.
