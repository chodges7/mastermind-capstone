from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required

# Create your views here.
def homeView(request):
    template = loader.get_template('home.html')
    context = {
        'foo':"bar",
    }
    return HttpResponse(template.render(context, request))

@login_required(login_url="/accounts/login/")
def gameView(request):
    template = loader.get_template('game.html')
    context = {
        'foo':'bar',
    }
    return HttpResponse(template.render(context, request))
