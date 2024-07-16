import json
import pytest
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from songbook.models import Artist, Song
from copy import copy

# Load the lyrics and chords of Stand By Me from Ben E. King
with open("tests/songbook/stand_by_me.json") as song:
    stand_by_me = json.load(song)
sbm = {}
sbm["structure"] = stand_by_me.pop("structure")
sbm["chords"] = stand_by_me
sbm["artist"] = "Ben E. King"
sbm["title"] = "Stand by Me"

@pytest.mark.django_db
class TestArtist:
    """ Tests for the Artist model.
    """
    def test_create_artist(self):
        """ Test that the Artist model can be created.
        """
        artist = Artist.objects.create(name=sbm["artist"])
        assert artist.name == sbm["artist"]

    def test_artist_str(self):
        """ Test that the Artist model can be represented as a string.
        """
        artist = Artist.objects.create(name=sbm["artist"])
        assert str(artist) == sbm["artist"]

    def test_clean_artist(self):
        """ Test that the Artist model can be cleaned.
        """
        artist = Artist.objects.create(name=sbm["artist"])
        artist.clean()
        assert artist.name == sbm["artist"]


@pytest.mark.django_db
class TestSong:
    """ Tests for the Song model.
    """
    def test_create_song(self):
        """ Test that the Song model can be created.
        """
        artist = Artist.objects.create(name=sbm["artist"])
        song = Song.objects.create(
            title=sbm["title"],
            artist=artist,
            lyrics_and_chords=sbm["chords"],
            structure=sbm["structure"]
        )
        assert song.title == sbm["title"]
        assert song.artist == artist
        assert song.lyrics_and_chords == sbm["chords"]
        assert isinstance(song.lyrics_and_chords, dict)
        assert song.structure == sbm["structure"]


    def test_song_str(self):
        """ Test that the Song model can be represented as a string.
        """
        artist = Artist.objects.create(name=sbm["artist"])
        song = Song.objects.create(
            title=sbm["title"],
            artist=artist,
            lyrics_and_chords=sbm["chords"],
            structure=sbm["structure"]
        )
        assert str(song) == sbm["title"] + " - " + sbm["artist"]

    def test_song_without_artist(self):
        """ Test that creating a Song raises an error without an artist.
        """
        with pytest.raises(IntegrityError):
            Song.objects.create(
                title=sbm["title"],
                lyrics_and_chords=sbm["chords"]
            )

    def test_song_clean(self):
        """ Test that the Song model can be cleaned.
        """
        artist = Artist.objects.create(name=sbm["artist"])
        song = Song.objects.create(
            title=sbm["title"],
            artist=artist,
            lyrics_and_chords=sbm["chords"],
            structure=sbm["structure"]
        )
        print(type(sbm["structure"]))
        print(type(song.structure))
        # Ensure the structure makes sense with the given lyrics and chords
        song.full_clean()

        assert song.title == sbm["title"]

    def test_song_creation_without_structure(self):
        """ Test that creating a Song without a structure raises an error.
        """
        artist = Artist.objects.create(name=sbm["artist"])
        song = Song(
            title=sbm["title"],
            artist=artist,
            lyrics_and_chords=sbm["chords"],
        )
        
        # Attempt to call full_clean and expect a ValidationError
        with pytest.raises(ValidationError) as excinfo:
            song.full_clean()

        assert "The structure field cannot be empty." in str(excinfo.value)

    def test_song_creation_wrong_structure(self):
        """ Test that creating a Song with an invalid structure raises an error.
        """
        # Setup
        structure = copy(sbm["structure"])
        structure = "The," + structure
        message = "'The' is mentioned in the structure but not found in the lyrics_and_chords field"
        artist = Artist.objects.create(name=sbm["artist"])
        song = Song(
            title=sbm["title"],
            artist=artist,
            lyrics_and_chords=sbm["chords"],
            structure=structure
        )
        
        # Attempt to call full_clean and expect a ValidationError
        with pytest.raises(ValidationError) as excinfo:
            song.full_clean()

        assert message in str(excinfo.value)

        