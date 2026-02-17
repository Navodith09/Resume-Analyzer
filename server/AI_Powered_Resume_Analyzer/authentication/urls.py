from django.urls import path
from . import views
from . import jwt_views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('history/', jwt_views.get_user_history, name='user_history'),
]
