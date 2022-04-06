# from django.shortcuts import render
import imp
from django.http import HttpResponse
from django.template import loader
from random_word import RandomWords
from random import choice
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

    word = str(getWord())

    context = {
        'page_title':'Mastermind',
        'word':word
    }
    return HttpResponse(template.render(context, request))

def getWord():
    rand = RandomWords()
    list = rand.get_random_words(minLength=4, maxLength=4, limit=10,
                       hasDictionaryDef=True, minCorpusCount=50)
    for word in list:
        if '.' in word:
            list.remove(word)
    return choice(list)
