from django.db import models


class Artist(models.Model):
    """ Model for the artists/performers linked with the song
    """

    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Song(models.Model):
    """ Song Model.
    Right now in the simpelest version.
    More fields can be added later.
    """
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='songs')
    lyrics_and_chords = models.JSONField()  # Using JSONField which works with SQLite

    def __str__(self):
        return self.title + " - " + self.artist.name
