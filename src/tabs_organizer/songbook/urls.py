from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"artists", views.ArtistViewSet)
router.register(r"songs", views.SongViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
