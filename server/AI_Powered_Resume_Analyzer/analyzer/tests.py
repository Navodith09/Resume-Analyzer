from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch, ANY

class ResumeAnalyzerTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/analyze/'

    @patch('analyzer.api.views.extract_text_from_file')
    @patch('analyzer.api.views.analyze_resume_with_gemini')
    def test_resume_analysis_title_only(self, mock_analyze, mock_extract):
        mock_extract.return_value = "Resume Content"
        mock_analyze.return_value = {"score": 80}
        
        resume_file = SimpleUploadedFile("resume.pdf", b"dummy", content_type="application/pdf")
        data = {'resume': resume_file, 'job_description': 'Full Job Description...'}
        
        self.client.post(self.url, data, format='multipart')
        
        # Verify call arguments
        mock_analyze.assert_called_with("Resume Content", 'Full Job Description...', 'Unknown Role')

    @patch('analyzer.api.views.extract_text_from_file')
    @patch('analyzer.api.views.analyze_resume_with_gemini')
    def test_single_input_auto_detect(self, mock_analyze, mock_extract):
        mock_extract.return_value = "Resume Content"
        mock_analyze.return_value = {"score": 80}
        
        resume_file = SimpleUploadedFile("resume.pdf", b"dummy", content_type="application/pdf")
        
        # Short input -> should become Title
        short_input = "Python Developer"
        data = {'resume': resume_file, 'job_description': short_input}
        
        self.client.post(self.url, data, format='multipart')
        
        # In the view, it passes (text, input, 'Unknown Role')
        # The auto-detect happens INSIDE analyze_resume_with_gemini.
        # So mocking analyze_resume_with_gemini defeats the purpose of testing logic INSIDE it?
        # Yes. We need to test the logic inside 'gemini_client.py'.
        # Since we mocked the service call in the view test, we aren't testing the auto-detect logic here.
        
        # We should test the service function directly for this logic.
        pass

from analyzer.services.gemini_client import analyze_resume_with_gemini
from unittest.mock import MagicMock

class GeminiServiceTests(TestCase):
    @patch('analyzer.services.gemini_client.genai.GenerativeModel')
    def test_auto_detect_title(self, mock_model):
        mock_instance = MagicMock()
        mock_model.return_value = mock_instance
        mock_response = MagicMock()
        mock_response.text = '{"score": 10}'
        mock_instance.generate_content.return_value = mock_response
        
        # Case 1: Short Description -> Treat as Title
        analyze_resume_with_gemini("Resume", "Python Dev")
        
        # Check the prompt content passed to generate_content
        args, _ = mock_instance.generate_content.call_args
        prompt = args[0]
        self.assertIn("Target Role: Python Dev", prompt)
        self.assertIn("Infer standard industry improvements", prompt)

    @patch('analyzer.services.gemini_client.genai.GenerativeModel')
    def test_long_description(self, mock_model):
        mock_instance = MagicMock()
        mock_model.return_value = mock_instance
        mock_response = MagicMock()
        mock_response.text = '{"score": 10}'
        mock_instance.generate_content.return_value = mock_response
        
        # Case 2: Long Description -> Treat as Description
        long_desc = "This is a very long job description that definitely exceeds the character limit for a job title..." * 10
        analyze_resume_with_gemini("Resume", long_desc)
        
        args, _ = mock_instance.generate_content.call_args
        prompt = args[0]
        self.assertIn("Job Description:", prompt)
        self.assertNotIn("Infer standard industry improvements", prompt)
