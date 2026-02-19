
    @patch('analyzer.api.views.extract_text_from_file')
    @patch('analyzer.api.views.analyze_resume_with_gemini')
    @patch('analyzer.api.views.ResumeAnalysisModel')
    @patch('jwt.decode')
    def test_job_title_update_from_analysis(self, mock_jwt, MockModel, mock_analyze, mock_extract):
        mock_extract.return_value = "Resume Content"
        mock_analyze.return_value = {
            "score": 85, 
            "extracted_job_title": "Senior Python Developer"
        }
        mock_jwt.return_value = {'user_id': 'test_user_id'}
        mock_model_instance = MockModel.return_value
        
        resume_file = SimpleUploadedFile("resume.pdf", b"dummy", content_type="application/pdf")
        # Only provide resume, no job title/desc -> Title will be 'Unknown Role' initially
        data = {'resume': resume_file}
        
        # Set auth header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer valid_token')
        
        response = self.client.post(self.url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify save_analysis was called with the EXTRACTED title
        mock_model_instance.save_analysis.assert_called_with(
            user_id='test_user_id',
            file_name='resume.pdf',
            job_title='Senior Python Developer', 
            ats_score=85,
            analysis_data=ANY
        )
