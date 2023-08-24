""" CoSpace ViewSet """
import json
from django.core.exceptions import PermissionDenied
from requests.exceptions import ConnectTimeout
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from magnify.apps.ciscomeetingserver.dao import CoSpaceDAO
from magnify.apps.ciscomeetingserver.serializers import CoSpaceSerializer, CoSpaceSecretSerializer
from magnify.apps.ciscomeetingserver.models import CoSpaceRoles
from magnify.apps.ciscomeetingserver.utils.ldap import sync_user_on_cisco
from magnify.apps.core.models import RoleChoices
from drf_spectacular.utils import extend_schema
from .. import consts

class CoSpaceViewSet(viewsets.GenericViewSet):
    """
    A simple ViewSet for listing coSpaces.
    """

    def list(self, request):
        """list all coSpaces"""

        dao = CoSpaceDAO()
        user_cospaces = CoSpaceRoles.objects.filter(user=request.user)
        data = []
        for role in user_cospaces:
            try:
                cospace = dao.get(cospace_id=role.cospace_cisco_id)
                data.append(cospace)
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

        serializer = CoSpaceSerializer(
            data,
            many=True,
            context={
                'request': self.request,
                "user": self.request.user
            }
        )
        return Response(serializer.data)

    def retrieve(self, request, pk):
        """return unique coSpace"""

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

        serializer = CoSpaceSerializer(
            data,
            context={
                'request': self.request,
                "user": self.request.user
            }
        )
        return Response(serializer.data)

    def create(self, request):
        sync_user_on_cisco(request.user)
        dao = CoSpaceDAO()
        cospace = dao.create(data = request.data, user = request.user)
        CoSpaceRoles.objects.create(
            user=request.user,
            cospace_cisco_id= cospace.cisco_id,
            role= RoleChoices.OWNER
        )
        serializer = CoSpaceSerializer(cospace)
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        dao = CoSpaceDAO()
        dao.delete(cospace_id=pk)
        CoSpaceRoles.objects.filter(cospace_cisco_id=pk).delete()
        return Response({})

    @extend_schema(
        request=CoSpaceSecretSerializer
    )
    @action(detail=True, methods=['PUT'])
    def update_secret(self, request, pk: str):
        body = json.loads(request.body)
        assert all(item in ["cospaceId", "owner_secret", "guest_secret"] for item in [item for item in body]) is True, "zeer!"
        dao = CoSpaceDAO()
        dao.update_accessmethod(cospace_id=pk, role=consts.ACCESS_METHODS_ORGANIZER_KEY, secret=body["owner_secret"])
        dao.update_accessmethod(cospace_id=pk, role=consts.ACCESS_METHODS_GUEST_KEY, secret=body["guest_secret"])
        return Response(body)
