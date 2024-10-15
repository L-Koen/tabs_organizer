from rest_framework import viewsets

from .models import Artist, Song
from .permissions import ReadOnlyOrAuthenticated
from .serializers import ArtistSerializer, SongListSerializer, SongDetailSerializer, SongCreateSerializer


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [ReadOnlyOrAuthenticated]


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    permission_classes = [ReadOnlyOrAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            # if list rerturn only artist and title
            return SongListSerializer
        elif self.action == 'retrieve':
            # if retrieve, return all fields
            return SongDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            # when editing, do not automatically replace artist.id with the full artist.
            return SongCreateSerializer
        return super().get_serializer_class()
