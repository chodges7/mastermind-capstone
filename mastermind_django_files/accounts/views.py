# accounts/views.py
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from . import forms

def signup(request):
    if request.method == 'POST':
        f = forms.CustomUserCreationForm(request.POST)
        if f.is_valid():
            new_user = f.save()
            messages.success(request, 'Account created successfully')
            new_user = authenticate(username=f.cleaned_data['username'],
                                    password=f.cleaned_data['password1'],)
            login(request, new_user)
            return redirect('/')

    else:
        f = forms.CustomUserCreationForm()

    return render(request, 'registration/signup.html', {'form': f})

# The majority of this def function came from this tutorial:
# https://simpleisbetterthancomplex.com/tutorial/2016/08/29/how-to-work-with-ajax-request-with-django.html
def validate_username(request):
    username = request.GET.get('username', None)
    data = {
        'is_taken': User.objects.filter(username__iexact=username).exists()
    }
    return JsonResponse(data)
