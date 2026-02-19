# Resume Analysis API Reference

**Base URL**: `/api`

## Analyze Resume

Analyzes an uploaded resume against a provided job description using Google Gemini AI to return matched skills, missing skills, an ATS score, and improvement suggestions.

- **URL**: `/analyze/`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `resume` | File | Yes | The resume file to analyze. Supported formats: PDF (`.pdf`), Word (`.docx`, `.doc`). |
| `job_description` | Text | **Required** | The input text. Can be a full Job Description, a short Job Title, **or a URL to a job posting**. The system auto-detects based on input. |
| `job_title` | Text | Optional | Specific job title (overrides auto-detection if provided). |

### Response Structure

Success Response (`200 OK`):

```json
{
  "score": 85.5,
  "analysis": {
    "matched_skills": [
      "Python",
      "Django",
      "REST API",
      "PostgreSQL"
    ],
    "missing_skills": [
      "Docker",
      "Kubernetes"
    ],
    "improvement_suggestions": [
      "Add experience with containerization tools like Docker.",
      "Highlight any cloud deployment experience."
    ],
    "professional_summary": "Experienced Backend Developer with 5+ years in Python/Django ecosystem...",
    "ats_score_explanation": "Strong match on core technical skills, but missing some modern DevOps requirements mentioned in the JD."
  }
}
```

Error Response (`400 Bad Request` or `500 Internal Server Error`):

```json
{
  "error": "Error message description"
}
```

### Example Usage (cURL)

```bash
curl -X POST http://localhost:8000/api/analyze/ \
  -F "resume=@/path/to/resume.pdf" \
  -F "job_description=Looking for Python Developer..." \
  -F "job_title=Python Dev"
```

---

# Authentication API Reference

**Base URL**: `/auth`

## Register

Registers a new user.

- **URL**: `/register/`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Response

Success (`201 Created`):

```json
{
  "message": "User registered successfully",
  "user_id": "unique_user_id_string"
}
```

## Sign In

Authenticates a user and sets session cookies.

- **URL**: `/signin/`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

### Response

Success (`200 OK`):

```json
{
  "message": "Signin successful",
  "user": {
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

## Sign Out

Logs out the current user and clears the session.

- **URL**: `/signout/`
- **Method**: `POST`

### Response

Success (`200 OK`):

```json
{
  "message": "Signout successful"
}
```

## Reset Password

Resets the password for a given username.

- **URL**: `/reset-password/`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "username": "johndoe",
  "new_password": "newsecurepassword456"
}
```

### Response

Success (`200 OK`):

```json
{
  "message": "Password reset successful"
}
```

## User History

Fetches the resume analysis history for the logged-in user.

- **URL**: `/auth/history/`
- **Method**: `GET`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`

### Response

Success (`200 OK`):

```json
{
  "history": [
    {
      "id": 1,
      "file_name": "resume.pdf",
      "job_title": "Python Developer",
      "score": 85.5,
      "created_at": "2023-10-27T10:00:00Z",
      "analysis": { ... }
    }
  ]
}
```
