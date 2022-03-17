# front_end/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.gameView, name='game'),
    path('home', views.homeView, name='home'),
]
