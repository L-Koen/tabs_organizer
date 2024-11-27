from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"artists", views.ArtistViewSet)
router.register(r"songs", views.SongViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth", views.LoginView.as_view(), name='login'),
    path("logout", views.LogoutView.as_view(), name='logout'),
    path("auth-check", views.AuthCheckView.as_view(), name="auth-check"),
]
