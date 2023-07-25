""" A DAO to process user data from cisco API """

from typing import List

import requests
import xmltodict

from magnify.apps.ciscomeetingserver.models import CiscoUser

from .. import consts
from .base import BaseDAO


class UserDAO(BaseDAO):
    """A DAO to process user data from cisco API"""

    KEYS_BINDING = [
        ("cisco_id", "@id"),
        ("name", "name"),
        ("user_jid", "userJid"),
        ("email", "email"),
        ("user_profile", "userProfile"),
    ]

    def get(self, user_id: str) -> CiscoUser:
        """get unique cisco user"""
        url = f"{consts.BASE_API_URL}/users/{user_id}"
        response = requests.get(url=url, auth=self.auth, verify=False, timeout=60)
        content = xmltodict.parse(response.content)
        user = CiscoUser()

        for keys in self.KEYS_BINDING:
            try:
                setattr(user, keys[0], content["user"][keys[1]])
            except KeyError:
                pass

        return user

    def get_all(self) -> List[CiscoUser]:
        """Get all cisco users"""
        url = f"{consts.BASE_API_URL}/users"
        response = requests.get(url=url, auth=self.auth, verify=False, timeout=60)
        content = xmltodict.parse(response.content)
        users = []
        for user in content["users"]["user"]:
            user_id = user["@id"]
            users.append(self.get(user_id=user_id))
        return users
