from django.db import models
import json

class ResumeAnalysis(models.Model):
    # Store MongoDB User ID as string
    user_id = models.CharField(max_length=255)
    resume_file_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255, blank=True)
    ats_score = models.FloatField()
    
    # Store the complex AI response as a JSON field
    # Using specific JSONField if using Djongo or standard Django with supported DBs
    # If using pure SQLite without JSON1 extension support in older Django, might need TextField
    # But Djongo supports JSONField.
    # We will use models.JSONField which is standard in recent Django versions.
    analysis_data = models.JSONField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_id} - {self.job_title} ({self.ats_score}%)"
