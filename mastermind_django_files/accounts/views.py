# accounts/views.py
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User

from . import forms

def signup(request):
    if request.method == 'POST':
        f = forms.CustomUserCreationForm(request.POST)
        if f.is_valid():
            f.save()
            messages.success(request, 'Account created successfully')
            return redirect('home')

    else:
        f = forms.CustomUserCreationForm()

    return render(request, 'registration/signup.html', {'form': f})

def validate_username(request):
    username = request.GET.get('username', None)
    data = {
        'is_taken': User.objects.filter(username__iexact=username).exists()
    }
    return JsonResponse(data)