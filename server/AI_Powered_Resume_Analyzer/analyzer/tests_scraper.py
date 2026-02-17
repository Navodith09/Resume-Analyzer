from django.test import TestCase
from unittest.mock import patch, MagicMock
from analyzer.services.scraper import scrape_job_description

class ScraperTests(TestCase):
    @patch('analyzer.services.scraper.requests.get')
    def test_scrape_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.content = b"<html><body><p>Software Engineer needed.</p></body></html>"
        mock_get.return_value = mock_response
        
        result = scrape_job_description("http://example.com")
        self.assertEqual(result, "Software Engineer needed.")

    @patch('analyzer.services.scraper.requests.get')
    def test_scrape_failure(self, mock_get):
        mock_get.side_effect = Exception("Connection Error")
        
        result = scrape_job_description("http://example.com")
        self.assertIsNone(result)
