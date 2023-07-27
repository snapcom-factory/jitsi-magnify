""" CoSpace ViewSet """
from django.core.exceptions import PermissionDenied

from requests.exceptions import ConnectTimeout
from rest_framework import viewsets
from rest_framework.response import Response

from magnify.apps.ciscomeetingserver.dao import CoSpaceDAO
from magnify.apps.ciscomeetingserver.serializers import CoSpaceSerializer


class CoSpaceViewSet(viewsets.GenericViewSet):
    """
    A simple ViewSet for listing coSpaces.
    """

    def list(self, request):
        """list all coSpaces"""

        dao = CoSpaceDAO()
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

    def retrieve(self, request, pk):
        """list unique coSpace"""

        dao = CoSpaceDAO()
        try:
            data = dao.get(cospace_id=pk)
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

        serializer = CoSpaceSerializer(data)
        return Response(serializer.data)
