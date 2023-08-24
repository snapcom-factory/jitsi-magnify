import pprint
from django.core.management.base import BaseCommand
from magnify.apps.ciscomeetingserver.consts import (
    CISCO_API_PASSWORD,
    CISCO_API_USERNAME,
)
from magnify.apps.ciscomeetingserver.dao import CoSpaceDAO

class Command(BaseCommand):
    help = "Add all users to the LDAP Server and sync them on CISCO"

    def handle(self, *args, **options):
        dao = CoSpaceDAO()
        id = dao.get_next_call_id()
        pprint.pprint(id)
    
    
