"""Serialize CoSpace model for the API."""
from rest_framework import serializers
from magnify.apps.ciscomeetingserver.models import CoSpace, CoSpaceRoles


class CoSpaceSerializer(serializers.ModelSerializer):
    """Serialize CoSpace model for the API."""
    role = serializers.SerializerMethodField()

    class Meta:
        model = CoSpace
        fields = [
            "name",
            "cisco_id",
            "call_id",
            "secret",
            "owner_call_id",
            "is_owner_ask_for_secret",
            "owner_secret",
            "guest_call_id",
            "is_guest_ask_for_secret",
            "guest_secret",
            "owner_jid",
            "owner_url",
            "guest_url",
            "role",
        ]

    def get_role(self, obj):
        user = self.context.get('user', None)
        if user:
            try:
                return CoSpaceRoles.objects.get(user=user, cospace_cisco_id=obj.cisco_id).role
            except CoSpaceRoles.DoesNotExist:
                return None
        return None


class CoSpaceSecretSerializer(serializers.ModelSerializer):
    """Serialize CoSpace model for the API."""
    owner_secret = serializers.CharField()
    guest_secret = serializers.CharField()
    class Meta:
        model = CoSpace
        fields = [
            "owner_secret",
            "guest_secret",
        ]
