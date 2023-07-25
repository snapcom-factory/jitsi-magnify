import pprint

from django.conf import settings
from django.core.management.base import BaseCommand

import requests
import xmltodict

from magnify.apps.ciscomeetingserver.models import ApiCredential
# from magnify.apps.core.models import User


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    # def add_arguments(self, parser):
    #     parser.add_argument("poll_ids", nargs="+", type=int)

    # requireCallId=true

    def handle(self, *args, **options):
        credentials = ApiCredential.objects.all()
        if len(credentials) > 0:
            credential = credentials[0]
            AUTH = (credential.username, credential.password)
        else:
            AUTH = ("", "")

        # users = User.objects.all().values('username', 'email', 'jwt_sub', 'is_device')
        # for u in users:
        #     print(u)

        # # 1: On récupère tous les utilisateurs
        # # TODO Get Or Create invite and organisateur
        # users_response = requests.get(
        #   f'{settings.CISCO_API_BASE_URL}/api/v1/users', auth=AUTH, verify=False
        # )
        # cisco_users = xmltodict.parse(users_response.content)

        # print(cisco_users)
        # pprint.pprint(cisco_users)

        user_response = requests.post(
            f"{settings.CISCO_API_BASE_URL}/api/v1/users",
            data={
                "userJid": "user@example.com",
                "name": "user@example.com",
                "email": "user@example.com",
                "userProfile": "99dd3914-7e44-4933-a34e-8e3ec41a9a33",
            },
            auth=AUTH,
            verify=False,
        )
        print(user_response)
        print(user_response.status_code)
        pprint.pprint(xmltodict.parse(user_response.content))
