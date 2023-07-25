"""Serialize CoSpace model for the API."""
from rest_framework import serializers

from magnify.apps.ciscomeetingserver.models import CoSpace


class CoSpaceSerializer(serializers.ModelSerializer):
    """Serialize CoSpace model for the API."""

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
        ]
