from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout as django_logout
from .models import User
import json

# Helper to serialize MongoDB User object
def serialize_user(user):
    if not user:
        return None
    return {
        'username': user['username'],
        'email': user['email']
    }

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            
            if not username or not password:
                return JsonResponse({'error': 'Username and password are required'}, status=400)
            
            user_model = User()
            try:
                user_id = user_model.create_user(username, email, password)
                return JsonResponse({'message': 'User registered successfully', 'user_id': user_id}, status=201)
            except ValueError as e:
                return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def signin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user_model = User()
            user = user_model.authenticate(username, password)
            if user:
                import jwt
                import datetime
                from django.conf import settings

                # Generate JWT
                payload = {
                    'user_id': str(user['_id']),
                    'email': user['email'],
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                    'iat': datetime.datetime.utcnow()
                }
                
                # Use SECRET_KEY from settings
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                
                return JsonResponse({
                    'message': 'Signin successful', 
                    'token': token,
                    'user': serialize_user(user)
                }, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def signout(request):
    if request.method == 'POST':
        try:
            # Clear manual session
            if 'user_id' in request.session:
                del request.session['user_id']
            if 'username' in request.session:
                del request.session['username']
            # Also call django logout just in case
            django_logout(request)
            return JsonResponse({'message': 'Signout successful'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            new_password = data.get('new_password')
            
            if not username or not new_password:
                return JsonResponse({'error': 'Username and new password are required'}, status=400)
            
            user_model = User()
            try:
                user_model.reset_password(username, new_password)
                return JsonResponse({'message': 'Password reset successful'}, status=200)
            except ValueError as e:
                return JsonResponse({'error': str(e)}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
