"""Serialier for the cisco module."""
from rest_framework import serializers

from magnify.apps.ciscomeetingserver.models import ApiCredential


class ApiCredentialSerializer(serializers.ModelSerializer):
    """Serialize ApiCredential model for the API."""

    class Meta:
        model = ApiCredential
        fields = ["username", "password"]
