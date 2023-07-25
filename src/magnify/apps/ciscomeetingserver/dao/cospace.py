""" A DAO to process cospace data from cisco API """
from typing import Any, List

from django.core.exceptions import PermissionDenied

import requests
import xmltodict

from magnify.apps.ciscomeetingserver.models import CoSpace

from .. import consts
from .base import BaseDAO


class CoSpaceDAO(BaseDAO):
    """A DAO to process cospace data from cisco API"""

    KEYS_BINDING = [
        ("cisco_id", "@id"),
        ("name", "name"),
        ("call_id", "callId"),
        ("secret", "secret"),
        ("owner_jid", "ownerJid"),
    ]

    def __init__(self, username: str, password: str) -> None:
        super().__init__(username=username, password=password)

    def _get_access_method(self, cospace_id: str, access_method_id: str) -> list:
        url = f"{consts.BASE_API_URL}/coSpaces/{cospace_id}/accessMethods/{access_method_id}"
        response = requests.get(url=url, auth=self.auth, verify=False, timeout=60)
        content = xmltodict.parse(response.content)
        return content["accessMethod"]

    def _get_all_access_methods(self, cospace_id: str) -> list:
        url = f"{consts.BASE_API_URL}/coSpaces/{cospace_id}/accessMethods"
        response = requests.get(url=url, auth=self.auth, verify=False, timeout=60)
        content = xmltodict.parse(response.content)

        try:
            guest_id = next(
                access_method
                for access_method in content["accessMethods"]["accessMethod"]
                if access_method["name"] == consts.ACCESS_METHODS_GUEST_KEY
            )["@id"]
            organizer_id = next(
                access_method
                for access_method in content["accessMethods"]["accessMethod"]
                if access_method["name"] == consts.ACCESS_METHODS_ORGANIZER_KEY
            )["@id"]
            access_methods = {
                consts.ACCESS_METHODS_GUEST_KEY: self._get_access_method(
                    cospace_id=cospace_id, access_method_id=guest_id
                ),
                consts.ACCESS_METHODS_ORGANIZER_KEY: self._get_access_method(
                    cospace_id=cospace_id, access_method_id=organizer_id
                ),
            }
            return access_methods
        except KeyError:
            return None
        except TypeError:
            return None

    def _get_base(self, cospace_id: str):
        """get base informations of cospace"""
        url = f"{consts.BASE_API_URL}/coSpaces/{cospace_id}"
        response = requests.get(url=url, auth=self.auth, verify=False, timeout=60)
        content = xmltodict.parse(response.content)
        cospace = CoSpace()

        for keys in self.KEYS_BINDING:
            try:
                setattr(cospace, keys[0], content["coSpace"][keys[1]])
            except KeyError:
                pass
        return cospace

    def get(self, cospace_id: str) -> CoSpace:
        """get unique cospace"""

        cospace = self._get_base(cospace_id=cospace_id)
        access_methods = self._get_all_access_methods(cospace_id=cospace_id)
        if access_methods is not None:
            try:
                cospace.owner_call_id = access_methods[
                    consts.ACCESS_METHODS_ORGANIZER_KEY
                ]["callId"]
                cospace.owner_secret = access_methods[
                    consts.ACCESS_METHODS_ORGANIZER_KEY
                ]["secret"]
                cospace.is_owner_ask_for_secret = (
                    cospace.owner_secret is not None and len(cospace.owner_secret) > 0
                )

                cospace.guest_call_id = access_methods[consts.ACCESS_METHODS_GUEST_KEY][
                    "callId"
                ]
                cospace.guest_secret = access_methods[consts.ACCESS_METHODS_GUEST_KEY][
                    "secret"
                ]
                cospace.is_guest_ask_for_secret = (
                    cospace.guest_secret is not None and len(cospace.guest_secret) > 0
                )
            except KeyError:
                pass

        return cospace

    def get_all(self) -> List[CoSpace]:
        """get all cospaces"""
        url = f"{consts.BASE_API_URL}/coSpaces"
        print(url)
        response = requests.get(url=url, auth=self.auth, verify=False, timeout=60)
        print("------>> ", response.status_code, type(response.status_code))
        if response.status_code == 401:
            raise PermissionDenied
        content = xmltodict.parse(response.content)
        cospaces = []
        for cospace in content["coSpaces"]["coSpace"]:
            cospace_id = cospace["@id"]
            cospaces.append(self.get(cospace_id=cospace_id))
        return cospaces

    def create_calllegprofile(self, name: str) -> str:
        """function to create a call leg profile"""
        return self._create_calllegprofile(name=name)

    def _create_calllegprofile(self, name: str) -> str:
        url = f"{consts.BASE_API_URL}/callLegProfiles"
        response = requests.post(
            url=url,
            data=consts.CALLLEGPROFILES_TEMPLATES[name],
            auth=self.auth,
            verify=False,
            timeout=60,
        )
        calllegprofile_id = response.headers["Location"].split("/")[-1]
        return calllegprofile_id

    def _get_or_create_calllegprofiles(self) -> Any:
        url = f"{consts.BASE_API_URL}/callLegProfiles"
        calllegprofiles_response = requests.get(
            url=url, auth=self.auth, verify=False, timeout=60
        )
        call_leg_profiles = xmltodict.parse(calllegprofiles_response.content)
        try:
            invite_id = [
                clp
                for clp in call_leg_profiles["callLegProfiles"]["callLegProfile"]
                if "name" in clp and clp["name"] == consts.ACCESS_METHODS_GUEST_KEY
            ][0]["@id"]
        except KeyError:
            invite_id = self._create_calllegprofile(
                name=consts.ACCESS_METHODS_GUEST_KEY
            )
        try:
            organisateur_id = [
                clp
                for clp in call_leg_profiles["callLegProfiles"]["callLegProfile"]
                if "name" in clp and clp["name"] == consts.ACCESS_METHODS_ORGANIZER_KEY
            ][0]["@id"]
        except KeyError:
            organisateur_id = self._create_calllegprofile(
                name=consts.ACCESS_METHODS_ORGANIZER_KEY
            )
        return {
            consts.ACCESS_METHODS_ORGANIZER_KEY: organisateur_id,
            consts.ACCESS_METHODS_GUEST_KEY: invite_id,
        }

    def create(self, data: dict) -> CoSpace:
        """Create coSpace"""

        # 1: Create coSpaces
        url = f"{consts.BASE_API_URL}/coSpaces"
        cospace_data = {**data, "requireCallId": True}
        response = requests.post(
            url=url, data=cospace_data, auth=self.auth, verify=False, timeout=30
        )
        cospace_cisco_id = response.headers["Location"].split("/")[-1]

        # 2: Create accessMethods
        cospace = self._get_base(cospace_id=cospace_cisco_id)
        calllegprofiles = self._get_or_create_calllegprofiles()

        organizer_data = {
            "callId": f"{cospace.call_id}00",
            "name": consts.ACCESS_METHODS_ORGANIZER_KEY,
            "callLegProfile": calllegprofiles[consts.ACCESS_METHODS_ORGANIZER_KEY],
        }
        guest_data = {
            "callId": f"{cospace.call_id}01",
            "name": consts.ACCESS_METHODS_GUEST_KEY,
            "callLegProfile": calllegprofiles[consts.ACCESS_METHODS_GUEST_KEY],
        }

        url = f"{consts.BASE_API_URL}/coSpaces/{cospace_cisco_id}/accessMethods"
        requests.post(
            url=url, data=organizer_data, auth=self.auth, verify=False, timeout=30
        )
        requests.post(
            url=url, data=guest_data, auth=self.auth, verify=False, timeout=30
        )

        # 3 and
        cospace = self.get(cospace_id=cospace_cisco_id)
        return cospace
