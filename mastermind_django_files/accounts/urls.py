# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('validate_username/', views.validate_username, name='validate_username'),
]