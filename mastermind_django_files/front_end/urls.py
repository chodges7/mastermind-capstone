# front_end/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.homeView, name='home'),
    path('game', views.gameView, name='game'),
]
