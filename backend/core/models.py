import datetime
from django.db import models
from django.db.models import Max
from decimal import Decimal

class Employee(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('information', 'Information'),
        ('cashier', 'Cashier'),
    ]

    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female')])
    address = models.TextField()
    contact_no = models.CharField(max_length=15)
    email_address = models.EmailField(unique=True)
    hire_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    profile_picture = models.ImageField(upload_to='employee_pics/', null=True, blank=True)
    
    account_type = models.CharField(max_length=15, choices=ROLE_CHOICES, default='information')

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.role}"


class Agent(models.Model):
    ROLE_CHOICES = [
        ('agent', 'Agent'),
        ('team_leader', 'Team Leader'),
    ]

    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female')])
    address = models.TextField()
    contact_no = models.CharField(max_length=15)
    email_address = models.EmailField(unique=True)
    hire_date = models.DateField()
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    account_type = models.CharField(max_length=15, choices=ROLE_CHOICES, default='agent')
    profile_picture = models.ImageField(upload_to='agent_pics/', null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.role}"


class Commission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('received', 'Received'),
        ('reported', 'Reported'),
    ]
    
    id = models.AutoField(primary_key=True)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='commissions', null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_awarded = models.DateField()
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    report_description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.agent.first_name} {self.agent.last_name}: {self.amount} - {self.status}"
    

class Plot(models.Model):
    STATUS_CHOICES = [
        ('occupied', 'Occupied'),
        ('vacant', 'Vacant'),
    ]

    plot_id = models.AutoField(primary_key=True)  # Automatically generated unique ID
    row = models.IntegerField(default=0)
    column = models.IntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='vacant')
    plot_type = models.CharField(max_length=30, choices=[
        ('stone', 'Stone Type'),
        ('lawn', 'Lawn Type'),
        ('valor', 'Valor Type'),
        ('mausoleum', 'Mausoleum'),
    ])
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    purchase_date = models.DateField(null=True, blank=True)
    owner = models.ForeignKey('Client', on_delete=models.CASCADE, related_name='plots', null=True, blank=True)

    class Meta:
        unique_together = ('row', 'column')  # Enforces uniqueness
        ordering = ['row', 'column']  # Grid-style ordering

    def __str__(self):
        return f"Plot {self.plot_id} (Row {self.row}, Column {self.column}) - {self.status}"




class Client(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female')])
    address = models.TextField()
    contact_no = models.CharField(max_length=15)
    email_address = models.EmailField(unique=True)
    account_type = models.CharField(max_length=10, choices=[('client', 'Client')])
    date_registered = models.DateField(auto_now_add=True)
    
    MODE_OF_PAYMENT_CHOICES = [
        ('cash', 'Cash'),
        ('installments', 'Installments'),
    ]
    mode_of_payment = models.CharField(max_length=20, choices=MODE_OF_PAYMENT_CHOICES, default='cash')
    balance_to_pay = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    plot = models.ForeignKey(Plot, on_delete=models.SET_NULL, null=True, blank=True)
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name='clients')
    
    # Added role field
    role = models.CharField(max_length=10, choices=[
        ('client', 'Client')
    ], default='client')

    def save(self, *args, **kwargs):
        if self.plot:
            self.balance_to_pay = self.plot.price
        super(Client, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.userid} - {self.first_name} {self.last_name}"
