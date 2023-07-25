from django.conf import settings
from django.core.management.base import BaseCommand

import requests
import xmltodict

from magnify.apps.ciscomeetingserver.models import ApiCredential


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def handle(self, *args, **options):
        credentials = ApiCredential.objects.all()
        if len(credentials) > 0:
            credential = credentials[0]
            AUTH = (credential.username, credential.password)
        else:
            AUTH = ("", "")

        # 1: On récupère les profiles "invite" et "organisateur"
        # TODO Get Or Create invite and organisateur
        calllegprofiles_response = requests.get(
            f"{settings.CISCO_API_BASE_URL}/api/v1/callLegProfiles",
            auth=AUTH,
            verify=False,
        )
        call_leg_profiles = xmltodict.parse(calllegprofiles_response.content)
        invite_id = [
            clp
            for clp in call_leg_profiles["callLegProfiles"]["callLegProfile"]
            if "name" in clp and clp["name"] == "invite"
        ][0]["@id"]
        organisateur_id = [
            clp
            for clp in call_leg_profiles["callLegProfiles"]["callLegProfile"]
            if "name" in clp and clp["name"] == "organisateur"
        ][0]["@id"]

        # 2: On crée la réunion
        cospace_response = requests.post(
            f"{settings.CISCO_API_BASE_URL}/api/v1/coSpaces",
            data={"requireCallId": True, "name": "Test from django"},
            auth=AUTH,
            verify=False,
        )
        # https://ciscocms.docs.apiary.io/#reference/cospace-related-methods/creating-and-modifying-a-cospace/creating-and-modifying-a-cospace
        cospace_uid = cospace_response.headers["Location"].split("/")[-1]
        cospace_response = requests.get(
            f"{settings.CISCO_API_BASE_URL}/api/v1/coSpaces/{cospace_uid}",
            auth=AUTH,
            verify=False,
        )
        print(xmltodict.parse(cospace_response.content))
        call_id = xmltodict.parse(cospace_response.content)["coSpace"]["callId"]

        # 3:On crée deux accessMethods pour la réunion: un avec
        # le profil invite et l'autre avec le profil organisateur
        accessmethod_response = requests.post(
            f"{settings.CISCO_API_BASE_URL}/api/v1/coSpaces/{cospace_uid}/accessMethods",
            data={
                "callId": f"{call_id}00",
                "name": "organisateur",
                "callLegProfile": organisateur_id,
            },
            auth=AUTH,
            verify=False,
        )
        print("accessmethod_response status_code: ", accessmethod_response.status_code)
        accessmethod_response = requests.post(
            f"{settings.CISCO_API_BASE_URL}/api/v1/coSpaces/{cospace_uid}/accessMethods",
            data={
                "callId": f"{call_id}01",
                "name": "invite",
                "callLegProfile": invite_id,
            },
            auth=AUTH,
            verify=False,
        )
        print("accessmethod_response status_code: ", accessmethod_response.status_code)
