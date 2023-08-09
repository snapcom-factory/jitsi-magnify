""" ApiCredential ViewSet """
from rest_framework import viewsets
from magnify.apps.ciscomeetingserver.models import CoSpaceRoles
from magnify.apps.ciscomeetingserver.serializers import CoSpaceRolesSerializer, CoSpaceRolesPostSerializer

class CoSpaceRolesViewSet(viewsets.ModelViewSet):
    filterset_fields = ['cospace_cisco_id']
    queryset = CoSpaceRoles.objects.all()    
    serializer_class = CoSpaceRolesSerializer
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CoSpaceRolesSerializer
        return CoSpaceRolesPostSerializer
