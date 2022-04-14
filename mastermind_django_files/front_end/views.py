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
                                    limit=10, hasDictionaryDef=True, minCorpusCount=225)
    print(words)
    if words is not None:
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
