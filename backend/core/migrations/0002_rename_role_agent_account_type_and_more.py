# Generated by Django 5.1.2 on 2024-11-20 17:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='agent',
            old_name='role',
            new_name='account_type',
        ),
        migrations.RenameField(
            model_name='employee',
            old_name='role',
            new_name='account_type',
        ),
    ]
