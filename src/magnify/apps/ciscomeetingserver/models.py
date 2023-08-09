""" CISCO app models """

from django.db import models
from django.utils.translation import gettext_lazy as _
from magnify.apps.ciscomeetingserver.consts import BASE_ROOMS_URL
from magnify.apps.core.models import BaseModel, User, RoleChoices


class CoSpaceRoles(BaseModel):
    """Model for CoSpaces rolses"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cospace_cisco_id = models.CharField(max_length=128)
    role = models.CharField(
        max_length=20, choices=RoleChoices.choices, default=RoleChoices.MEMBER
    )
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "cospace_cisco_id"],
                name="unique CoSpace Role",
            )
        ]


class CiscoUser(BaseModel):
    """Model for cisco user"""

    cisco_id = models.CharField(max_length=128)
    user_jid = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    email = models.CharField(max_length=128)
    user_profile = models.CharField(max_length=128, null=True, blank=True)


class CoSpace(BaseModel):
    """Model for one coSpace"""

    name = models.CharField(max_length=500)
    cisco_id = models.CharField(max_length=128)

    call_id = models.CharField(max_length=128)
    secret = models.CharField(max_length=128, null=True, blank=True)

    owner_call_id = models.CharField(max_length=500, blank=True, null=True)
    is_owner_ask_for_secret = models.BooleanField(default=False)
    owner_secret = models.CharField(max_length=128, null=True, blank=True)

    guest_call_id = models.CharField(max_length=500, blank=True, null=True)
    is_guest_ask_for_secret = models.BooleanField(default=False)
    guest_secret = models.CharField(max_length=128, null=True, blank=True)

    owner_jid = models.CharField(max_length=128, null=True, blank=True)

    @property
    def owner_url(self) -> str:
        """get meeting owner url"""
        if self.owner_call_id is not None and self.owner_secret is not None:
            return f"{BASE_ROOMS_URL}/meeting/{self.owner_call_id}?secret={self.owner_secret}"
        return None

    @property
    def guest_url(self) -> str:
        """get meeting guest url"""
        if self.guest_call_id is not None and self.guest_secret is not None:
            return f"{BASE_ROOMS_URL}/meeting/{self.guest_call_id}?secret={self.guest_secret}"
        return None

    class Meta:
        ordering = ("name",)
        verbose_name = _("Cisco Room")
        verbose_name_plural = _("Cisco Rooms")

    def __str__(self):
        return self.name
