# Generated by Django 4.1.4 on 2022-12-27 15:47

import uuid

import django.contrib.auth.models
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models

import timezone_field.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        max_length=30,
                        unique=True,
                        validators=[
                            django.core.validators.RegexValidator(
                                "^[a-z0-9_-]*$",
                                message="Username must contain only lower case letters, numbers, underscores and hyphens.",
                            )
                        ],
                        verbose_name="username",
                    ),
                ),
                ("name", models.CharField(blank=True, max_length=255, null=True)),
                ("email", models.EmailField(max_length=255, unique=True)),
                (
                    "language",
                    models.CharField(
                        choices=[("en", "English"), ("fr", "French")],
                        default="en",
                        help_text="The language in which the user wants to see the interface.",
                        max_length=10,
                        verbose_name="language",
                    ),
                ),
                (
                    "timezone",
                    timezone_field.fields.TimeZoneField(
                        choices_display="WITH_GMT_OFFSET", default="UTC", use_pytz=False
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "User",
                "verbose_name_plural": "Users",
                "db_table": "magnify_user",
                "ordering": ("username",),
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="Group",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("token", models.CharField(max_length=100)),
                (
                    "administrators",
                    models.ManyToManyField(
                        blank=True,
                        related_name="is_administrator_of",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Group",
                "verbose_name_plural": "Groups",
                "db_table": "magnify_group",
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="Label",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "color",
                    models.CharField(
                        max_length=7,
                        validators=[
                            django.core.validators.RegexValidator(
                                code="nomatch",
                                message="Color must be a valid hexa code",
                                regex="^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
                            )
                        ],
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Label",
                "verbose_name_plural": "Labels",
                "db_table": "magnify_label",
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="Meeting",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                ("name", models.CharField(max_length=500)),
                ("start", models.DateTimeField()),
                ("end", models.DateTimeField()),
                (
                    "timezone",
                    timezone_field.fields.TimeZoneField(
                        choices_display="WITH_GMT_OFFSET", use_pytz=False
                    ),
                ),
                (
                    "recurrence",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("daily", "Daily"),
                            ("weekly", "Weekly"),
                            ("monthly", "Monthly"),
                            ("yearly", "Yearly"),
                        ],
                        max_length=10,
                        null=True,
                    ),
                ),
                ("frequency", models.PositiveIntegerField(default=1)),
                ("recurring_until", models.DateTimeField(blank=True, null=True)),
                ("nb_occurrences", models.PositiveIntegerField(blank=True, null=True)),
                (
                    "weekdays",
                    models.CharField(
                        blank=True,
                        max_length=7,
                        null=True,
                        validators=[
                            django.core.validators.RegexValidator(
                                "^[0-6]{0,7}$",
                                message="Weekdays must contain the numbers of the active days.",
                            )
                        ],
                    ),
                ),
                (
                    "monthly_type",
                    models.CharField(
                        choices=[
                            ("date_day", "Every month on this date"),
                            ("nth_day", "Every month on the nth week day of the month"),
                        ],
                        default="date_day",
                        max_length=10,
                    ),
                ),
                ("is_public", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Meeting",
                "verbose_name_plural": "Meetings",
                "db_table": "magnify_meeting",
                "ordering": ("-start",),
            },
        ),
        migrations.CreateModel(
            name="Room",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("slug", models.SlugField(max_length=100, unique=True)),
                ("is_public", models.BooleanField(default=False)),
                (
                    "configuration",
                    models.JSONField(
                        blank=True,
                        default=dict,
                        help_text="Values for Jitsi parameters to configure the room via the iframe API.",
                        verbose_name="Jitsi room configuration",
                    ),
                ),
            ],
            options={
                "verbose_name": "Room",
                "verbose_name_plural": "Rooms",
                "db_table": "magnify_room",
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="RoomUserAccess",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[
                            ("member", "Member"),
                            ("administrator", "Administrator"),
                            ("owner", "Owner"),
                        ],
                        default="member",
                        max_length=20,
                    ),
                ),
                (
                    "room",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_accesses",
                        to="core.room",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="room_accesses",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Room user access",
                "verbose_name_plural": "Room user accesses",
                "db_table": "magnify_room_user_access",
                "unique_together": {("user", "room")},
            },
        ),
        migrations.CreateModel(
            name="RoomGroupAccess",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[("member", "Member"), ("administrator", "Admin")],
                        default="member",
                        max_length=20,
                    ),
                ),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="room_accesses",
                        to="core.group",
                    ),
                ),
                (
                    "room",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="group_accesses",
                        to="core.room",
                    ),
                ),
            ],
            options={
                "verbose_name": "Room group access",
                "verbose_name_plural": "Room group accesses",
                "db_table": "magnify_room_group_access",
                "unique_together": {("group", "room")},
            },
        ),
        migrations.AddField(
            model_name="room",
            name="groups",
            field=models.ManyToManyField(
                blank=True,
                related_name="rooms",
                through="core.RoomGroupAccess",
                to="core.group",
            ),
        ),
        migrations.AddField(
            model_name="room",
            name="labels",
            field=models.ManyToManyField(
                blank=True, related_name="is_room_label_of", to="core.label"
            ),
        ),
        migrations.AddField(
            model_name="room",
            name="users",
            field=models.ManyToManyField(
                related_name="rooms",
                through="core.RoomUserAccess",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.CreateModel(
            name="MeetingUserAccess",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[
                            ("member", "Member"),
                            ("administrator", "Administrator"),
                            ("owner", "Owner"),
                        ],
                        default="member",
                        max_length=20,
                    ),
                ),
                (
                    "meeting",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_accesses",
                        to="core.meeting",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="meeting_accesses",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Meeting user access",
                "verbose_name_plural": "Meeting user accesses",
                "db_table": "magnify_meeting_user_access",
                "unique_together": {("user", "meeting")},
            },
        ),
        migrations.CreateModel(
            name="MeetingGroupAccess",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="primary key for the record as UUID",
                        primary_key=True,
                        serialize=False,
                        verbose_name="id",
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[("member", "Member"), ("administrator", "Admin")],
                        default="member",
                        max_length=20,
                    ),
                ),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="meeting_accesses",
                        to="core.group",
                    ),
                ),
                (
                    "meeting",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="group_accesses",
                        to="core.meeting",
                    ),
                ),
            ],
            options={
                "verbose_name": "Meeting group access",
                "verbose_name_plural": "Meeting group accesses",
                "db_table": "magnify_meeting_group_access",
                "unique_together": {("group", "meeting")},
            },
        ),
        migrations.AddField(
            model_name="meeting",
            name="groups",
            field=models.ManyToManyField(
                blank=True,
                related_name="meetings",
                through="core.MeetingGroupAccess",
                to="core.group",
            ),
        ),
        migrations.AddField(
            model_name="meeting",
            name="labels",
            field=models.ManyToManyField(
                blank=True, related_name="is_meeting_label_of", to="core.label"
            ),
        ),
        migrations.AddField(
            model_name="meeting",
            name="room",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="meetings",
                to="core.room",
            ),
        ),
        migrations.AddField(
            model_name="meeting",
            name="users",
            field=models.ManyToManyField(
                related_name="meetings",
                through="core.MeetingUserAccess",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="group",
            name="labels",
            field=models.ManyToManyField(
                blank=True, related_name="is_group_label_of", to="core.label"
            ),
        ),
        migrations.AddField(
            model_name="group",
            name="members",
            field=models.ManyToManyField(
                blank=True, related_name="is_member_of", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddConstraint(
            model_name="meeting",
            constraint=models.CheckConstraint(
                check=models.Q(("end__gte", models.F("start"))),
                name="end_greater_than_start",
            ),
        ),
        migrations.AddConstraint(
            model_name="meeting",
            constraint=models.CheckConstraint(
                check=models.Q(
                    ("recurring_until__gte", models.F("start")),
                    ("recurring_until__isnull", True),
                    _connector="OR",
                ),
                name="recurring_until_greater_than_start",
            ),
        ),
        migrations.AddConstraint(
            model_name="meeting",
            constraint=models.CheckConstraint(
                check=models.Q(("frequency__gte", 1)), name="frequency_gte_1"
            ),
        ),
        migrations.AddConstraint(
            model_name="meeting",
            constraint=models.CheckConstraint(
                check=models.Q(
                    models.Q(
                        ("nb_occurrences__isnull", True),
                        ("recurring_until__isnull", True),
                    ),
                    models.Q(
                        ("nb_occurrences__isnull", False),
                        ("recurring_until__isnull", False),
                    ),
                    _connector="OR",
                ),
                name="recurring_until_and_nb_occurrences_mutually_null_or_not",
            ),
        ),
    ]
