import logging
import json
import google.generativeai as genai
from django.conf import settings

logger = logging.getLogger(__name__)

# Configure Gemini
if hasattr(settings, 'GEMINI_API_KEY'):
    genai.configure(api_key=settings.GEMINI_API_KEY)

def analyze_resume_with_gemini(resume_text, job_description, job_title=None):
    """
    Analyzes the resume text against the job description using Gemini.
    If job_description is missing, it uses the job_title to infer requirements.
    """
    if not resume_text:
        return {"error": "No text extracted from resume"}
    
    if not job_description and not job_title:
        return {"error": "No job description or job title provided"}

    # Auto-detect if job_description is actually a job title (single input scenario)
    if job_description and not job_title:
        # Heuristic: If input is short (e.g., < 200 chars) and doesn't look like a full description, treat as title
        if len(job_description.strip()) < 200:
            job_title = job_description
            logger.info(f"Auto-detected Job Title from input: {job_title}")
            # We can clear job_description or keep it. 
            # If we keep it, the prompt below needs to handle "short description" vs "title".
            # Let's treat it as title specifically for the prompt context.
            job_description = None

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')

        if job_description:
            prompt_context = f"Job Description:\n{job_description}"
        else:
            prompt_context = f"Target Role: {job_title}\n(Note: No job description was provided. Infer standard industry improvements and skills for this role.)"

        prompt = f"""
        Analyze the following resume against the target role/description.

        Resume:
        {resume_text}

        {prompt_context}

        Return a JSON object with the following keys:
        - matched_skills: [list of skills found in both]
        - missing_skills: [list of key skills expected for this role but not in resume]
        - improvement_suggestions: [list of actionable tips]
        - professional_summary: "4-5 line professional summary of the candidate based on the resume"
        - ats_score_explanation: "brief reasoning for the score"

        Output strictly JSON.
        """

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        return json.loads(response.text)
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error in Gemini analysis: {error_msg}")
        
        if "429" in error_msg:
            return {"error": "AI Service is busy (Rate Limit Exceeded). Please try again later."}
        
        return {"error": f"AI analysis failed: {error_msg}"}
