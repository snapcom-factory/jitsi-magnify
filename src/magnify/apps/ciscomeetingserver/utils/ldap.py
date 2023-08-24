from ldap3 import Connection, Server, ALL, Tls
import ssl
from magnify.apps.core.models import User
from magnify.apps.ciscomeetingserver.dao import UserDAO
from magnify.apps.ciscomeetingserver.consts import CISCO_LDAP_HOST, CISCO_LDAP_PORT

def add_user_to_ldap_server(user: User) -> None:
    tls_config = Tls(validate=ssl.CERT_NONE)
    s = Server(host=CISCO_LDAP_HOST, port=CISCO_LDAP_PORT, use_ssl=False, get_info=ALL, tls=tls_config)
    c = Connection(s, user='cn=admin,dc=my-domain,dc=com', password='snapcom')
    c.bind()
    c.add(
        f'uid={user.username},dc=my-domain,dc=com',
        attributes={
            'objectClass':  ['inetOrgPerson', 'organizationalPerson', 'person'],
            'sn': user.username or "",
            'cn': user.name or "",
            'givenName': user.name or "",
            'uid': user.username or "",
            'mail': user.email or "",
        }
    )
    print(c.result)
    c.unbind()

def sync_user_on_cisco(user: User) -> None:
    add_user_to_ldap_server(user)
    dao = UserDAO()
    dao.sync_ldap()
