from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.
def homeView(request):
    template = loader.get_template('home.html')
    context = {
        'foo':"bar",
    }
    return HttpResponse(template.render(context, request))