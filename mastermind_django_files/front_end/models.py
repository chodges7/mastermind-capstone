from django.db import models
from django.contrib.auth import get_user_model

def default_json():
    return {"guess0":"", "guess1":"", "guess2":"", "guess3":"", "guess4":"", "guess5":""}

class Games(models.Model):

    # Fields
    game_id   = models.CharField(max_length = 50, primary_key = True)
    completed = models.BooleanField(default = False)
    guesses   = models.JSONField(default = default_json)
    gamer     = models.ForeignKey(get_user_model(), on_delete = models.CASCADE)

    # Metadata
    class Meta:
        ordering            = ['gamer', 'game_id']
        verbose_name        = "Mastermind Game"
        verbose_name_plural = "Mastermind Games"

    # Methods
    def __str__(self):
        return self.game_id
