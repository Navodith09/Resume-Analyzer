from django.urls import path
from .api.views import ResumeAnalyzeView

urlpatterns = [
    path('analyze/', ResumeAnalyzeView.as_view(), name='analyze_resume'),
]
