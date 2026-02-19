from authentication.utils import get_db_handle
import datetime
import uuid

class ResumeAnalysisModel:
    def __init__(self):
        self.db, self.client = get_db_handle()
        self.collection = self.db['resume_analysis']

    def save_analysis(self, user_id, file_name, job_title, ats_score, analysis_data):
        analysis_record = {
            'user_id': user_id,
            'resume_file_name': file_name,
            'job_title': job_title,
            'ats_score': ats_score,
            'analysis_data': analysis_data,
            'created_at': datetime.datetime.utcnow(),
            'analysis_id': str(uuid.uuid4())
        }
        result = self.collection.insert_one(analysis_record)
        return str(result.inserted_id)

    def get_analysis_history(self, user_id):
        # Return cursor as list
        return list(self.collection.find({'user_id': user_id}).sort('created_at', -1))
