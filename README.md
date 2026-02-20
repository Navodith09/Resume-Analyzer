# Resume Evaluator

The Resume Evaluator is a full-stack web application designed to evaluate resumes against target job descriptions and titles using state-of-the-art AI. The application processes uploaded files, extracts the text, and leverages Google's Gemini API to calculate an Applicant Tracking System (ATS) score while providing actionable insights to candidates.

## 🚀 Purpose
With the rise of automated ATS filters, candidates often struggle to know if their resumes truly align with job requirements. This project empowers job seekers by highlighting keyword gaps, suggesting direct improvements, and generating a quantitative alignment score so they can tailor their applications for higher success rates.

## 🛠 Features
- **File Parsing**: Upload PDF or DOCX files directly for text extraction without third-party web parsing.
- **Smart ATS Engine**: Employs heuristic fallback checks so resumes can be scored even without full job descriptions (just job titles).
- **Gemini AI Integration**: Uses the powerful generative AI (`gemini-2.5-flash`) to contextually examine text for matched skills, missing skills, and overall narrative.
- **JWT Authentication**: Secure user registration, sign in, and password reset flows directly connected to a MongoDB instance.
- **OTP Email Validation**: Includes secure OTP (One Time Password) email verification workflows.

## 💻 Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Django, Django REST Framework, Python (`pdfplumber`/`docx2txt`)
- **Database**: MongoDB (via PyMongo/Motor)
- **AI Integration**: Google Generative AI API (`google.generativeai`)

## 📂 Project Structure

```bash
AI Powered Resume Analyzer/
│
├── client/
│   └── AI-Powered-Resume-Analyzer/ # React single-page application
│       ├── public/                 # Static assets
│       ├── src/
│       │   ├── components/         # Reusable UI components (Results, Navbar, etc.)
│       │   ├── context/            # Global state context
│       │   ├── pages/              # Main route views (Home, Register, Login)
│       │   ├── services/           # API fetch wrappers and interceptors
│       │   └── utils/              # Helper functions (e.g. PDF generation)
│       ├── package.json
│       └── vite.config.js
│
└── server/
    └── AI_Powered_Resume_Analyzer/ # Django Backened Application
        ├── AI_Powered_Resume_Analyzer/ # Core settings and Root URLs
        ├── analyzer/               # Resume processing and validation App
        │   ├── api/                # Core DRF views taking file uploads
        │   └── services/           # Business logic (Gemini handlers, scrapers, extractors)
        ├── authentication/         # User logic App
        │   ├── models.py           # Custom Mongo wrapper models (User, Token, OTP)
        │   └── views.py            # Login, Registration, OTP, Logout routes
        ├── manage.py
        └── requirements.txt
```

## ⚙️ Development Setup

**1. Configure the Backend (Django):**
```bash
cd server/AI_Powered_Resume_Analyzer
python -m venv .venv

# Windows activation
.\.venv\Scripts\activate

# Mac/Linux activation
source .venv/bin/activate

pip install -r requirements.txt
```

Set up your `.env` variables inside `server/AI_Powered_Resume_Analyzer/.env`:
```ini
DEBUG=True
SECRET_KEY=your_django_secret
GEMINI_API_KEY=your_google_ai_studio_api_key
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=resume_analyzer_db
EMAIL_HOST_USER=your_email_address
EMAIL_HOST_PASSWORD=your_app_password
```

Run the server:
```bash
python manage.py runserver
```

**2. Configure the Frontend (React):**
```bash
cd client/AI-Powered-Resume-Analyzer
npm install
```

Set up `.env` inside `client/AI-Powered-Resume-Analyzer/.env`:
```ini
VITE_API_BASE_URL=http://localhost:8000
```

Run the React development server:
```bash
npm run dev
```

---

## 👨‍💻 Ownership & License

This project is created and maintained by **Navodith Mondal**. 
All rights reserved for the Resume Evaluator concepts and implementations.

**Created:** February 2026
**Last Updated:** February 2026
