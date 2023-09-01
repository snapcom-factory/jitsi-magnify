""" CISCO objects serialiser """
from .ldap import add_user_to_ldap_server, sync_user_on_cisco

__all__ = [
    "add_user_to_ldap_server",
    "sync_user_on_cisco",
]
