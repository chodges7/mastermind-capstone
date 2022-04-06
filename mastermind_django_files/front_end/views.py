# from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from random_word import RandomWords
# from django.contrib.auth.decorators import login_required

# Create your views here.
def home_view(request):
    template = loader.get_template('home.html')
    context = {
        'page_title':"Homepage",
    }
    return HttpResponse(template.render(context, request))

def game_view(request):
    template = loader.get_template('game.html')
    r = RandomWords()

    word = r.get_random_word(minLength=4, maxLength=4,
                         hasDictionaryDef=True, minCorpusCount=50)
    context = {
        'page_title':'Mastermind',
        'word':word
    }
    return HttpResponse(template.render(context, request))
