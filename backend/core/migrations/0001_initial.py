# Generated by Django 5.1.2 on 2024-11-21 01:36

import django.db.models.deletion
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Agent',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('middle_name', models.CharField(blank=True, max_length=30)),
                ('age', models.PositiveIntegerField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=10)),
                ('address', models.TextField()),
                ('contact_no', models.CharField(max_length=15)),
                ('email_address', models.EmailField(max_length=254, unique=True)),
                ('hire_date', models.DateField()),
                ('commission_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('role', models.CharField(choices=[('agent', 'Agent'), ('team_leader', 'Team Leader')], default='agent', max_length=15)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='agent_pics/')),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('middle_name', models.CharField(blank=True, max_length=30)),
                ('age', models.PositiveIntegerField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=10)),
                ('address', models.TextField()),
                ('contact_no', models.CharField(max_length=15)),
                ('email_address', models.EmailField(max_length=254, unique=True)),
                ('hire_date', models.DateField()),
                ('salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='employee_pics/')),
                ('role', models.CharField(choices=[('admin', 'Admin'), ('information', 'Information'), ('cashier', 'Cashier')], default='information', max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('middle_name', models.CharField(blank=True, max_length=30)),
                ('age', models.PositiveIntegerField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=10)),
                ('address', models.TextField()),
                ('contact_no', models.CharField(max_length=15)),
                ('email_address', models.EmailField(max_length=254, unique=True)),
                ('account_type', models.CharField(choices=[('client', 'Client')], max_length=10)),
                ('date_registered', models.DateField(auto_now_add=True)),
                ('mode_of_payment', models.CharField(choices=[('cash', 'Cash'), ('installments', 'Installments')], default='cash', max_length=20)),
                ('balance_to_pay', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10)),
                ('role', models.CharField(choices=[('client', 'Client')], default='client', max_length=10)),
                ('agent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='clients', to='core.agent')),
            ],
        ),
        migrations.CreateModel(
            name='Commission',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date_awarded', models.DateField()),
                ('description', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('received', 'Received'), ('reported', 'Reported')], default='pending', max_length=10)),
                ('report_description', models.TextField(blank=True, null=True)),
                ('agent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='commissions', to='core.agent')),
            ],
        ),
        migrations.CreateModel(
            name='Plot',
            fields=[
                ('plot_id', models.AutoField(primary_key=True, serialize=False)),
                ('plot_code', models.CharField(max_length=10, unique=True)),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('status', models.CharField(choices=[('occupied', 'Occupied'), ('vacant', 'Vacant')], default='vacant', max_length=10)),
                ('plot_type', models.CharField(choices=[('stone', 'Stone Type'), ('lawn', 'Lawn Type'), ('valor', 'Valor Type'), ('mausoleum', 'Mausoleum')], max_length=30)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('purchase_date', models.DateField(blank=True, null=True)),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='plots', to='core.client')),
            ],
        ),
        migrations.AddField(
            model_name='client',
            name='plot',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.plot'),
        ),
    ]
