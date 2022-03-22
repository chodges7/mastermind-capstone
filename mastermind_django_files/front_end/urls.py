# front_end/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_view, name='game'),
    path('home', views.home_view, name='home'),
]
