from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..services.extractors import extract_text_from_file
from ..services.gemini_client import analyze_resume_with_gemini
from ..services.score_engine import calculate_ats_score
from ..mongo_models import ResumeAnalysisModel
from .serializers import ResumeAnalysisSerializer

class ResumeAnalyzeView(APIView):
    def post(self, request):
        serializer = ResumeAnalysisSerializer(data=request.data)
        if not serializer.is_valid():
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            resume_file = request.FILES.get('resume')
            job_description = serializer.validated_data.get('job_description')
            job_title = serializer.validated_data.get('job_title', 'Unknown Role')

            # Check if job_description is a URL
            if job_description and (job_description.startswith('http://') or job_description.startswith('https://')):
                from ..services.scraper import scrape_job_description
                scraped_content = scrape_job_description(job_description)
                if scraped_content:
                    job_description = scraped_content
                else:
                    # Fallback or error - deciding to proceed with empty/original or fail?
                    # Let's proceed but maybe warn? For now, we proceed as is, 
                    # Gemini might handle the URL text itself or complain.
                    pass 

            if not resume_file:
                 return Response({'error': 'No resume file provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Note: The uploaded file is processed entirely in-memory using its stream. 
            # We do not save to disk, which saves storage and improves security/speed.
            
            # --- 1. Extract Text from PDF/Docx ---
            # Utilize pdfplumber or docx2txt inside this service to get raw text.
            resume_text = extract_text_from_file(resume_file)
            if not resume_text:
                return Response({'error': 'Failed to extract text from resume'}, status=status.HTTP_400_BAD_REQUEST)

            # --- 2. AI Analysis via Gemini API ---
            # Pass both description and title. The Gemini API service handles 
            # structuring the prompt and fallback if a description is missing.
            analysis = analyze_resume_with_gemini(resume_text, job_description, job_title)
            if "error" in analysis:
                return Response({'error': analysis['error']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # 3. Calculate Score
            final_score = calculate_ats_score(analysis)

            # Update job_title if it was unknown and AI extracted one effectively
            if job_title == 'Unknown Role' and analysis.get('extracted_job_title'):
                job_title = analysis.get('extracted_job_title')

            # --- 4. Relational Database & State Storage ---
            # If the user is authenticated via JWT (token passed in Authorization header),
            # we decode the user_id and save the record to MongoDB so they can view history.
            import jwt
            from django.conf import settings
            
            user_id = None
            if 'Authorization' in request.headers:
                try:
                    token = request.headers['Authorization'].split(' ')[1]
                    data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                    user_id = data['user_id']
                except Exception as e:
                    # Token invalid or expired, but we still allow analysis, just don't save
                    pass

            if user_id:

                ResumeAnalysisModel().save_analysis(
                    user_id=user_id,
                    file_name=resume_file.name,
                    job_title=job_title,
                    ats_score=final_score,
                    analysis_data=analysis
                )

            return Response({
                "score": final_score,
                "analysis": analysis
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
