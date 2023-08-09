"""Serialier for the cisco module."""
from rest_framework import serializers
from magnify.apps.ciscomeetingserver.models import CoSpaceRoles
from magnify.apps.core.serializers.users import UserSerializer


class CoSpaceRolesSerializer(serializers.ModelSerializer):
    """Serialize ApiCredential model for the API."""
    user = UserSerializer()
    class Meta:
        model = CoSpaceRoles
        fields = ["id", "cospace_cisco_id", "role", "user"]

class CoSpaceRolesPostSerializer(serializers.ModelSerializer):
    """Serialize ApiCredential model for the API post endpoint."""
    class Meta:
        model = CoSpaceRoles
        fields = ["id", "cospace_cisco_id", "role", "user"]
