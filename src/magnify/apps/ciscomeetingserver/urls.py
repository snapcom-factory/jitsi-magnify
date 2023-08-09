"""Urls declarations for Magnify's core app."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from magnify.apps.ciscomeetingserver.views import CoSpaceRolesViewSet, CoSpaceViewSet

router = DefaultRouter()
router.register(
    "cospace-roles", CoSpaceRolesViewSet, basename="cisco-cospace-rolses"
)
router.register("cospaces", CoSpaceViewSet, basename="cisco-cospace")

urlpatterns = [
    path("", include(router.urls)),
]
