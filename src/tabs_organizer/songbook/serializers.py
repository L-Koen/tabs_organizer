from rest_framework import serializers

from .models import Artist, Song


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = "__all__"


# Lightweight serializer for listing songs
class SongListSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer()  # Nested serializer to get artist name

    class Meta:
        model = Song
        fields = ['id', 'title', 'artist']

# Detailed serializer for fetching song details
class SongDetailSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer()

    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'lyrics_and_chords', 'structure']

class SongCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'lyrics_and_chords', 'structure']
