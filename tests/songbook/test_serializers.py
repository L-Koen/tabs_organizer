import pytest
from rest_framework.exceptions import ValidationError
from songbook.serializers import ArtistSerializer, SongListSerializer, SongDetailSerializer
from songbook.models import Artist

@pytest.mark.django_db
class TestArtistSerializer:
    """ Test the ArtistSerializer for REST API use
    """
    def test_artist_serializer_valid_data(self):
        data = {'name': 'The Beatles'}
        serializer = ArtistSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data == data

    def test_artist_serializer_invalid_data(self):
        data = {'name': ''}
        serializer = ArtistSerializer(data=data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError):
            serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
class TestSongDetailSerializer:
    """ Test the SongSerializer for REST API use
    """
    def test_song_serializer_valid_data(self):
        artist = Artist.objects.create(name='The Beatles')
        data = {
            'title': 'Hey Jude',
            'artist': {"name": "The Beatles"},
            'lyrics_and_chords': {'verse1': 'Hey Jude, don\'t make it bad'},
            'structure': 'verse1'
        }
        serializer = SongDetailSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data['title'] == 'Hey Jude'

    def test_song_serializer_invalid_data(self):
        data = {
            'title': '',
            'artist': None,
            'lyrics_and_chords': {},
            'structure': ''
        }
        serializer = SongDetailSerializer(data=data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError):
            serializer.is_valid(raise_exception=True)