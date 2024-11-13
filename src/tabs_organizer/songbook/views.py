from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.middleware.csrf import get_token

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


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            response = Response({"message": "Login successful"})
            
            # Set the token in an HTTP-only cookie
            response.set_cookie(
                key='auth_token',
                value=token.key,
                httponly=True,
                secure=True,  # Set to True in production
                samesite='Lax'  # or 'Strict' if feasible
            )
            
            # Include CSRF token in response if needed
            response.set_cookie('csrftoken', get_token(request), httponly=False, secure=True)
            
            return response
        return Response({"error": "Invalid credentials"}, status=400)