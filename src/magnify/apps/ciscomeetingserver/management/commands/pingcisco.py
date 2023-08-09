from django.core.management.base import BaseCommand
from magnify.apps.ciscomeetingserver.consts import (
    CISCO_API_PASSWORD,
    CISCO_API_USERNAME,
)
from ... import consts
import requests
import xmltodict
import pprint


class Command(BaseCommand):
    help = "Ping CISCO"

    def handle(self, *args, **options):
        AUTH = (CISCO_API_USERNAME, CISCO_API_PASSWORD)
        url = f"{consts.BASE_API_URL}/coSpaces/0f3d2d4f-d389-4e26-a315-dad2d4e8dac9/accessMethods/ad4b71aa-0284-405c-9100-be5fba942d39"
        response = requests.get(url=url, auth=AUTH, verify=False, timeout=60)
        content = xmltodict.parse(response.content)
        pprint.pprint(content["accessMethod"])
