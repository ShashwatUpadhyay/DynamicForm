# Generated by Django 5.2.3 on 2025-07-06 16:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0003_alter_question_is_required'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Response',
            new_name='Responses',
        ),
    ]
