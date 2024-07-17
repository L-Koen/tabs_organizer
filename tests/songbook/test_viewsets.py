import pytest
from django.urls import reverse
from songbook.models import Artist, Song

@pytest.mark.django_db
class TestArtistViewSet:
    """ Tests for the Artist REST API viewset.
    """
    def setup_method(self):
        """Setup method to define common attributes for tests.
        """
        self.url = reverse('artist-list')
        self.artist_data = {'name': 'The Beatles'}

    def test_create_artist_authenticated(self, authenticated_client):
        """ Test that an authenticated user can create an artist.
        """
        response = authenticated_client.post(self.url, self.artist_data, format='json')
        assert response.status_code == 201
        assert response.data['name'] == self.artist_data['name']

    def test_create_artist_unauthenticated(self, api_client):
        """ Test that an unauthenticated user cannot create an artist.
        """
        response = api_client.post(self.url, self.artist_data, format='json')
        assert response.status_code == 403  # Forbidden

    def test_get_artist_list(self, api_client):
        """ Test that an unauthenticated user can retrieve the artist list.
        """
        Artist.objects.create(name=self.artist_data["name"])
        response = api_client.get(self.url, format='json')
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]['name'] == self.artist_data['name']


@pytest.mark.django_db
class TestSongViewSet:
    """ Tests for the Song REST API viewset.
    """
    def setup_method(self):
        """ Setup method to define common attributes for tests.
        """
        self.url = reverse('song-list')
        self.artist = Artist.objects.create(name='The Beatles')
        self.song_data = {
            'title': 'Hey Jude',
            'artist': self.artist.id,
            'lyrics_and_chords': {'verse1': 'Hey Jude, don\'t make it bad'},
            'structure': 'verse1'
        }

    def test_create_song_authenticated(self, authenticated_client):
        """ Test that an authenticated user can create a song.
        """
        response = authenticated_client.post(self.url, self.song_data, format='json')
        assert response.status_code == 201
        assert response.data['title'] == self.song_data['title']

    def test_create_song_unauthenticated(self, api_client):
        """ Test that an unauthenticated user cannot create a song.
        """
        response = api_client.post(self.url, self.song_data, format='json')
        assert response.status_code == 403  # Forbidden

    def test_get_song_list(self, api_client):
        """ Test that an unauthenticated user can retrieve the song list.
        """
        Song.objects.create(
            title=self.song_data['title'],
            artist=self.artist,
            lyrics_and_chords=self.song_data['lyrics_and_chords'],
            structure=self.song_data['structure']
        )
        response = api_client.get(self.url, format='json')
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]['title'] == self.song_data['title']
