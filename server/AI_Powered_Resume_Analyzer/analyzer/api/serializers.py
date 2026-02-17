from rest_framework import serializers

class ResumeAnalysisSerializer(serializers.Serializer):
    resume = serializers.FileField()
    job_description = serializers.CharField(required=False, allow_blank=True)
    job_title = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        """
        Check that either job_description or job_title is provided.
        """
        jd = data.get('job_description')
        title = data.get('job_title')

        if not jd and not title:
            raise serializers.ValidationError("Either 'job_description' or 'job_title' is required.")
        
        return data
