# Generated by Django 5.1.2 on 2024-11-22 15:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_rename_role_agent_account_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='plot',
            name='owner',
        ),
    ]