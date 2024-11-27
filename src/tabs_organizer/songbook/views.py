from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator


from .models import Artist, Song
from .permissions import ReadOnlyOrAuthenticated
from .serializers import ArtistSerializer, SongListSerializer, SongDetailSerializer, SongCreateSerializer


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [ReadOnlyOrAuthenticated]


@method_decorator(ensure_csrf_cookie, name='dispatch')
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


@method_decorator(ensure_csrf_cookie, name='dispatch')
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
                samesite="None"  # or 'Strict' if feasible
            )
            
            return response
        return Response({"error": "Invalid credentials"}, status=400)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully."}, status=200)
        # Remove the token cookie
        response.delete_cookie('auth_token')  # Match the cookie name set during login
        return response


@method_decorator(ensure_csrf_cookie, name='dispatch')
class AuthCheckView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request, *args, **kwargs):
        return Response({"authenticated": True}, status=200)