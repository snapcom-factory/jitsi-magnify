from django.core.management.base import BaseCommand

from magnify.apps.ciscomeetingserver.dao.cospace import CoSpaceDAO


class Command(BaseCommand):
    help = "Ping CISCO"

    def handle(self, *args, **options):
        cospace_dao = CoSpaceDAO(username="", password="")
        cospace = cospace_dao.create(
            data={"name": "Second test from django", "ownerJid": "jobe@snapcom.fr"}
        )
        print("\n------------------------")
        print("************************")
        print(f"@id: {cospace.cisco_id}")
        print(f"name: {cospace.name}")
        print(f"call_id: {cospace.call_id}")
        print(f"secret: {cospace.secret}")
        print(f"owner_call_id: {cospace.owner_call_id}")
        print(f"is_owner_ask_for_secret: {cospace.is_owner_ask_for_secret}")
        print(f"owner_secret: {cospace.owner_secret}")
        print(f"guest_call_id: {cospace.guest_call_id}")
        print(f"is_guest_ask_for_secret: {cospace.is_guest_ask_for_secret}")
        print(f"guest_secret: {cospace.guest_secret}")
        print(f"owner_jid: {cospace.owner_jid}")
        # cospace.save()
