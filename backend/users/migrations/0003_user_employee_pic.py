# Generated by Django 5.1.5 on 2025-03-01 03:34

import users.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_account_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='employee_pic',
            field=models.ImageField(blank=True, null=True, upload_to=users.models.upload_to),
        ),
    ]
