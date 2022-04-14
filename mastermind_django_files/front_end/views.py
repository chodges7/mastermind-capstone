from random import choice
from re import sub
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

    word = str(get_word())
    word = word.upper()

    context = {
        'page_title':'Mastermind',
        'word':word
    }
    return HttpResponse(template.render(context, request))

def get_word():
    word_length = 4
    rand = RandomWords()
    words = rand.get_random_words(minLength=word_length, maxLength=word_length, 
                                    limit=10, hasDictionaryDef=True, minCorpusCount=200)
    print(words)
    for word in words:
        words.remove(word)
        if word == None:
            continue
        print(word)
        word = sub(r'[\W_]+', '', word)
        print(word)
        if len(word) == 4:
            words.append(word)
    print(words)

    return choice(words)
