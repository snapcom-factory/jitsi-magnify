"""Urls declarations for Magnify's core app."""

from django.urls import include, path

from rest_framework.routers import DefaultRouter

from magnify.apps.ciscomeetingserver.views import ApiCredentialViewSet, CoSpaceViewSet

router = DefaultRouter()
router.register(
    "api-credentials", ApiCredentialViewSet, basename="cisco-api-credential"
)
router.register("cospaces", CoSpaceViewSet, basename="cisco-cospace")

# To appear on the swagger URL,
# the views need to extend APIView from the rest_framework.views package.
urlpatterns = [
    path("", include(router.urls)),
]
