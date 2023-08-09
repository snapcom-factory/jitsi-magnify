"""Admin classes and registrations for cisco app."""
from django.contrib import admin
from .models import CoSpaceRoles


@admin.register(CoSpaceRoles)
class CoSpaceRolesAdmin(admin.ModelAdmin):
    """Admin class for the CoSpaceRoles model"""

    list_display = ["user", "cospace_cisco_id", "role"]
