# Generated by Django 5.2.3 on 2025-07-07 22:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0004_rename_response_responses'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='responses',
            options={'get_latest_by': 'created_at'},
        ),
        migrations.AddField(
            model_name='responses',
            name='sheet_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='responses',
            name='sheet_url',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
