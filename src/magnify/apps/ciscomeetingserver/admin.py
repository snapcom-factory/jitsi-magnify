"""Admin classes and registrations for cisco app."""
from django.contrib import admin

from .models import ApiCredential


@admin.register(ApiCredential)
class ApiCredentialAdmin(admin.ModelAdmin):
    """Admin class for the cisco ApiCredential model"""

    list_display = ["user", "username", "password"]
