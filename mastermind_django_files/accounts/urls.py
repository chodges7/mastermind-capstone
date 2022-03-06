# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('password_reset/', views.password_reset_request, name="password_reset")
]