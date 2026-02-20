from django.urls import path
from . import views
from . import jwt_views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('request-password-reset/', views.request_password_reset_otp, name='request_password_reset_otp'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('history/', jwt_views.get_user_history, name='user_history'),
]
