# Generated by Django 5.1.2 on 2025-02-23 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_alter_block_block_name_alter_block_coordinates'),
    ]

    operations = [
        migrations.AlterField(
            model_name='block',
            name='coordinates',
            field=models.TextField(blank=True, null=True),
        ),
    ]
