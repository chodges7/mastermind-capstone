# front_end/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_view, name='game'),
    path('stats', views.stats_view, name='stats'),
    path('about', views.about_view, name='about'),
    path('guess_entry', views.game_entry, name='entry'),
]
