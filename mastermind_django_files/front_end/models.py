from tabnanny import verbose
from django.db import models
from django.contrib.auth import get_user_model

def default_json():
    return {"guesses": ["default"]}

class Games(models.Model):
    # Fields
    game_id   = models.CharField(max_length=50, primary_key=True)
    completed = models.BooleanField(default=False)
    guesses   = models.JSONField(default=default_json)
    gamer     = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    # Metadata
    class Meta:
        ordering            = ['gamer', 'game_id']
        verbose_name        = "Mastermind Game"
        verbose_name_plural = "Mastermind Games"

    # Methods
    def __str__(self):
        return str(self.gamer) + " - " + self.game_id

class Stats(models.Model):
    # Fields
    total_games   = models.IntegerField(default=0)
    gamer         = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    total_guesses = models.IntegerField(default=0)
    avg_guesses   = models.DecimalField(max_digits=4, decimal_places=3, default=0.000)
    total_time    = models.DecimalField(max_digits=7, decimal_places=3, default=0000.000)
    avg_time      = models.DecimalField(max_digits=7, decimal_places=3, default=0000.000)

    # Metadata
    class Meta:
        ordering            = ['gamer', 'total_games']
        verbose_name        = "Stats Model"
        verbose_name_plural = "Stats Models"

    # Methods
    def __str__(self):
        return str(self.gamer) + " - games: " + self.total_games
