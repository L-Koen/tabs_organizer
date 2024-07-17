from rest_framework import viewsets

from .models import Artist, Song
from .permissions import ReadOnlyOrAuthenticated
from .serializers import ArtistSerializer, SongSerializer


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [ReadOnlyOrAuthenticated]


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [ReadOnlyOrAuthenticated]
