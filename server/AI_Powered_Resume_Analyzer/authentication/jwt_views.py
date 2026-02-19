import jwt
from django.conf import settings
from django.http import JsonResponse
from functools import wraps
from analyzer.mongo_models import ResumeAnalysisModel

def jwt_required(f):
    @wraps(f)
    def decorated(request, *args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return JsonResponse({'error': 'Token is missing'}, status=401)
        
        try:
            data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            request.user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        
        return f(request, *args, **kwargs)
    return decorated

@jwt_required
def get_user_history(request):
    if request.method == 'GET':
        try:
            # Fetch history for the user from ResumeAnalysis (MongoDB)
            history = ResumeAnalysisModel().get_analysis_history(request.user_id)
            
            data = []
            for item in history:
                data.append({
                    'id': str(item['analysis_id']),
                    'file_name': item['resume_file_name'],
                    'job_title': item['job_title'],
                    'score': item['ats_score'],
                    'created_at': item['created_at'].isoformat(),
                    'analysis': item['analysis_data']
                })
            
            return JsonResponse({'history': data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
