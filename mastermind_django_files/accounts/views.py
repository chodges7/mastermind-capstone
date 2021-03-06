# accounts/views.py
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login

from . import forms

def signup(request):
    if request.method == 'POST':
        form = forms.CustomUserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            messages.success(request, 'Account created successfully')
            new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password1'],)
            login(request, new_user)
            return redirect('/')

    else:
        form = forms.CustomUserCreationForm()

    return render(request, 'registration/signup.html', {'form': form})

# The majority of this def function came from this tutorial:
# https://simpleisbetterthancomplex.com/tutorial/2016/08/29/how-to-work-with-ajax-request-with-django.html
def validate_username(request):
    username = request.GET.get('username', None)
    user = get_user_model()
    data = {
        'is_taken': user.objects.filter(username__iexact=username).exists()
    }
    if data['is_taken']:
        data['error_message'] = 'A user with this username already exists.'
    return JsonResponse(data)
