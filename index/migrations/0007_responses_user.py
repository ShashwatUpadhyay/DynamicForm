# Generated by Django 5.2.3 on 2025-07-09 12:45

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0006_remove_responses_sheet_id_remove_responses_sheet_url_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='responses',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='responses', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
