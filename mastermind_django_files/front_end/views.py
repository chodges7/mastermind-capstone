from random import choice
from re import sub
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth import get_user_model
from random_word import RandomWords
from .models import Games
from hashlib import sha1
from time import time, sleep
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

    word = "pear" # str(get_word())
    word = word.upper()
    current_game_id = get_game_id()
    game = Games(game_id = current_game_id, gamer = request.user)
    game.save()

    context = {
        'page_title':'Mastermind',
        'word':word
    }
    return HttpResponse(template.render(context, request))

def get_game_id():
    hash = sha1()
    hash.update(str(time()).encode('utf-8'))
    print(hash.hexdigest())
    return hash.hexdigest()

def get_word():
    word_length = 4
    rand = RandomWords()
    words = rand.get_random_words(minLength=word_length, maxLength=word_length,
                                    limit=10, hasDictionaryDef=True, minCorpusCount=200)
    print(words)
    if words is None:
        sleep(.5)
        return get_word()
    for word in words:
        temp = word
        words.remove(word)
        if temp is None:
            continue
        print("before sub:", temp)
        temp = sub(r'[\W_]+', '', temp)
        print("after sub:", temp)
        if len(temp) == 4:
            words.append(temp)
    print(words)

    return choice(words)
