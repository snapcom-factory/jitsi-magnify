""" CoSpace ViewSet """
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from requests.exceptions import ConnectTimeout
from rest_framework import viewsets
from rest_framework.response import Response

from magnify.apps.ciscomeetingserver.dao import CoSpaceDAO
from magnify.apps.ciscomeetingserver.models import ApiCredential
from magnify.apps.ciscomeetingserver.serializers import CoSpaceSerializer


class CoSpaceViewSet(viewsets.GenericViewSet):
    """
    A simple ViewSet for listing coSpaces.
    """

    def list(self, request):
        """list all coSpaces"""
        queryset = ApiCredential.objects.all()
        credential = get_object_or_404(queryset, user=self.request.user)
        dao = CoSpaceDAO(username=credential.username, password=credential.password)
        try:
            data = dao.get_all()
        except PermissionDenied:
            return Response(
                {"error": "Permission penied. Please verify your CISCO credentials"},
                status=401,
            )
        except ConnectTimeout:
            return Response(
                {
                    "error": "Connection Timeout. Check if your backend can access cisco's API"
                },
                status=500,
            )

        serializer = CoSpaceSerializer(data, many=True)
        return Response(serializer.data)
