from hashlib import sha1
from time import time
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Games, Stats

# ----- VIEWS -----
def about_view(request):
    template = loader.get_template('about.html')
    context = {
        'page_title':"About Page",
    }
    return HttpResponse(template.render(context, request))

@login_required(redirect_field_name='login')
def game_view(request):
    template = loader.get_template('game.html')

    # does the current user have a game going?
    current_game_id = get_game_id(request.user)
    game = Games.objects.filter(game_id = current_game_id, gamer = request.user)
    if not game.exists():
        game = Games(game_id=current_game_id, gamer=request.user)
        game.save()

    # does the user have a stats model?
    stats = get_stats(request.user)

    # context for the page
    context = {
        'page_title':'Mastermind',
        'game_id': current_game_id,
        'stats': stats
    }
    return HttpResponse(template.render(context, request))

@method_decorator(csrf_exempt, name='dispatch')
def game_entry(request):
    # if we're doing a POST then do this:
    if request.method == "POST":
        # Grab all of the data we'll need from the request
        game_id   = request.POST.get('game_id')
        guesses   = request.POST.get('guesses')
        completed = request.POST.get('completed', False) # default is false

        # Filter for the game object we need
        Games.objects.filter(game_id=game_id).update(guesses=guesses, completed=completed)

        # Grab the json version of the game...
        json_game = serializers.serialize("json", Games.objects.filter(game_id=game_id))
        # ... so we can return it for debug purposes
        return JsonResponse({'game': json_game})
    # else just return "None"
    if request.method == "GET":
        # Grab all the data we'll need from the request
        game_id = request.GET.get('game_id')

        # Grab the json version of the game...
        game = Games.objects.filter(game_id=game_id).values_list("guesses")
        # game = serializers.serialize("json", Games.objects.filter(game_id=game_id))
        print(game)
        # ...so we can return it
        return JsonResponse(list(game), safe=False)
    return JsonResponse({'game': None})


@method_decorator(csrf_exempt, name='dispatch')
def stats_entry(request):
    # if we're doing a POST then do this:
    if request.method == "POST":
        # Grab all of the data we'll need from the request
        guesses = request.POST.get('guesses')

        # Filter for the game object we need
        stats = Stats.objects.filter(gamer=request.user).values()

        print("STATS QUERYSET:", stats)

        total_guesses = stats[0]['total_guesses'] + int(guesses)
        total_games = stats[0]['total_games'] + 1
        print(stats)
        Stats.objects.filter(gamer=request.user).update(
            total_guesses=total_guesses,
            total_games=total_games)

        # return JsonResponse that model was updated
        return JsonResponse({'stats': "updated"})
    # else just return "None"
    return JsonResponse({'stats': None})


@login_required(redirect_field_name='login')
def stats_view(request):
    template = loader.get_template('stats.html')

    # does the user have a stats model?
    stats = get_stats(request.user)

    if stats.total_games > 0:
        avg_guesses = stats.total_guesses / stats.total_games
    else:
        avg_guesses = 0.0

    all_stats = Stats.objects.all()

    context = {
        'page_title': "Stats Page",
        'total_guesses': stats.total_guesses,
        'total_games': stats.total_games,
        'avg_guesses': avg_guesses,
        'all_stats': all_stats
    }
    return HttpResponse(template.render(context, request))

# ----- FUNCTIONS -----

def get_game_id(cur_user):
    ret = ""
    # print(previous_games)

    # filter for incomplete games with the same user
    previous_games = Games.objects.filter(gamer=cur_user, completed=False)

    # if any exist, send that game's id
    if previous_games.exists():
        ret = previous_games[0].game_id
    # if none exist then make a new id
    else:
        my_hash = sha1()
        my_hash.update(str(time()).encode('utf-8'))
        print(my_hash.hexdigest())
        ret = my_hash.hexdigest()
    # return the id
    return ret

def get_stats(cur_user):
    ret = ""

    # filter for stats with the same user
    previous_stats = Stats.objects.filter(gamer=cur_user)

    # if any exist, send that Stats model
    if previous_stats.exists():
        ret = previous_stats[0]
    # if none exist then return new Stats model
    else:
        ret = Stats(gamer=cur_user)
        ret.save()

    # return the Stats
    return ret
