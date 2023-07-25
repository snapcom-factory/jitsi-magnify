""" ApiCredential ViewSet """

from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.response import Response

from magnify.apps.ciscomeetingserver.models import ApiCredential
from magnify.apps.ciscomeetingserver.serializers import ApiCredentialSerializer


class ApiCredentialViewSet(viewsets.GenericViewSet):
    """
    A simple ViewSet for listing or retrieving ApiCredential.
    """

    def list(self, request):
        """get cisco api credentials of connected user"""
        try:
            credential = ApiCredential.objects.get(user=self.request.user)
            serializer = ApiCredentialSerializer(credential)
            return Response(serializer.data)
        except ApiCredential.DoesNotExist:
            return Response({"username": None, "password": None})

    # FIXME: Understand why in swagger we don't see the body sample
    @extend_schema(
        request=ApiCredentialSerializer,
    )
    def create(self, request):
        """create or retrieving cisco credentials for connected user"""
        try:
            credential = ApiCredential.objects.get(user=self.request.user)
        except ApiCredential.DoesNotExist:
            credential = ApiCredential(user=self.request.user)
        username = request.data.get("username")
        password = request.data.get("password")
        credential.username = username
        credential.password = password
        credential.save()
        serializer = ApiCredentialSerializer(credential)
        return Response(serializer.data)
