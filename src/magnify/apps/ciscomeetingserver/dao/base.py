""" A base DAO objet """
from magnify.apps.ciscomeetingserver.consts import (
    CISCO_API_PASSWORD,
    CISCO_API_USERNAME,
)


class BaseDAO:
    """A base DAO objet"""

    AUTH = (CISCO_API_USERNAME, CISCO_API_PASSWORD)
