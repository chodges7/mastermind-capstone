# accounts/views.py
from django.shortcuts import render, redirect
from django.contrib import messages
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
