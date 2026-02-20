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

                # --- Generate JWT Token ---
                # Creates a stateless session token that stores the user_id and email, 
                # valid for 1 day, reducing the need for continuous DB queries.
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
            # --- Clear User Session ---
            # Remove identifying data from the server-side Django session if it exists.
            if 'user_id' in request.session:
                del request.session['user_id']
            if 'username' in request.session:
                del request.session['username']
            # Also call django logout just in case to clear any built-in auth logic.
            django_logout(request)
            return JsonResponse({'message': 'Signout successful'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def request_password_reset_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return JsonResponse({'error': 'Email is required'}, status=400)
            
            user_model = User()
            # Check if user exists with this email
            # Note: The User model doesn't have a get_by_email method shown, but we can query the collection directly or add one.
            # Let's assume we can find one.
            user = user_model.collection.find_one({'email': email})
            if not user:
                 return JsonResponse({'error': 'User with this email does not exist'}, status=404)

            from .models import OTP
            otp_model = OTP()
            # Generate a 6-digit numeric OTP and store it against the user's email in DB
            otp_code = otp_model.create_otp(email)
            
            # --- Email Dispatch via Resend HTTP API ---
            # Using Resend instead of standard SMTP avoids Render's port 587 blockages.
            import threading
            import resend
            from django.conf import settings
            import os
            
            # Setup Resend API Key from Environment
            resend.api_key = os.getenv('RESEND_API_KEY')
            
            subject = 'Password Reset OTP - Resume Evaluator'
            message = f'Your OTP for password reset is: {otp_code}\n\nThis OTP is valid for 10 minutes.\nIf you did not request a password reset, please ignore this email.'
            # Resend requires a verified domain or 'onboarding@resend.dev' for free testing
            from_email = os.getenv('RESEND_FROM_EMAIL', 'onboarding@resend.dev')
            recipient_list = [email]
            
            def send_email_async():
                try:
                    params = {
                        "from": from_email,
                        "to": recipient_list,
                        "subject": subject,
                        "text": message,
                    }
                    resend.Emails.send(params)
                except Exception as e:
                    print(f"Failed to send email via Resend: {e}")
            
            threading.Thread(target=send_email_async).start()
            print(f"DEBUG: OTP generated and Resend thread started. OTP is {otp_code}")
            
            return JsonResponse({'message': 'OTP generated and email dispatch requested via Resend.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def verify_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            otp = data.get('otp')
            new_password = data.get('new_password')
            
            if not email or not otp or not new_password:
                return JsonResponse({'error': 'Email, OTP, and new password are required'}, status=400)
            
            from .models import OTP
            otp_model = OTP()
            if otp_model.verify_otp(email, otp):
                # OTP is valid, reset password
                user_model = User()
                # We need to reset password by email, but the model method uses username.
                # Let's check the User model again. It has reset_password(username, new_password).
                # We should update User model to allow reset by email or find username first.
                user = user_model.collection.find_one({'email': email})
                if user:
                    user_model.reset_password(user['username'], new_password)
                    return JsonResponse({'message': 'Password reset successful'}, status=200)
                else:
                     return JsonResponse({'error': 'User not found'}, status=404)
            else:
                return JsonResponse({'error': 'Invalid or expired OTP'}, status=400)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
