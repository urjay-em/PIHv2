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
    commision_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    profile_picture = models.ImageField(upload_to='agent_pics/', null=True, blank=True)
    
    account_type = models.CharField(max_length=15, choices=ROLE_CHOICES, default='agent')

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.role}"


class Transaction(models.Model):
    agent = models.ForeignKey(Agent, related_name='transactions', on_delete=models.CASCADE)
    transaction_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return f"Transaction on {self.transaction_date} for {self.agent}"


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
    

class Block(models.Model):
    block_name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    coordinates = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.block_name

class Price(models.Model):
    PRICE_TYPE_CHOICES = [
        ('stone', 'Stone Type'),
        ('lawn', 'Lawn Type'),
        ('valor', 'Valor Type'),
        ('mausoleum', 'Mausoleum'),
    ]
    
    plot_type = models.CharField(max_length=30, choices=PRICE_TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('plot_type',)

    def __str__(self):
        return f"Price for {self.plot_type} in Block {self.block.block_name}: {self.price}"
    

class Plot(models.Model):
    STATUS_CHOICES = [
        ('occupied', 'Occupied'),
        ('vacant', 'Vacant'),
        ('reserved', 'Reserved'),
    ]

    plot_id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='vacant')
    plot_type = models.CharField(max_length=30, choices=[
        ('stone', 'Stone Type'),
        ('lawn', 'Lawn Type'),
        ('valor', 'Valor Type'),
        ('mausoleum', 'Mausoleum'),
    ])
    purchase_date = models.DateField(null=True, blank=True)
    owner = models.ForeignKey('Client', on_delete=models.SET_NULL, related_name='plots', null=True, blank=True)
    
    block = models.ForeignKey('Block', on_delete=models.CASCADE, related_name='plots', null=True)
    

    max_bodies = models.PositiveIntegerField(default=2)


    plot_name = models.CharField(max_length=255, blank=False, null=False) 
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def get_price(self):
        """Fetch the price based on plot type."""
        try:
            price_entry = Price.objects.get(plot_type=self.plot_type)
            return price_entry.price
        except Price.DoesNotExist:
            return 0

    class Meta:
        unique_together = ('plot_id', 'block')
        ordering = ['block', 'plot_id']

    def assign_owner(self, client):
        """Assign a client as the owner of this plot."""
        if self.status == 'vacant':
            self.owner = client
            self.status = 'occupied'
            self.purchase_date = datetime.date.today()
            self.save()
        else:
            raise ValueError("Plot is not available for purchase.")

    def save(self, *args, **kwargs):
        """Save the plot with dynamically set name and max_bodies."""
        if self.plot_type in ['stone', 'lawn', 'valor']:
            self.max_bodies = 2
        elif self.plot_type == 'mausoleum':
            self.max_bodies = 6

        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Plot {self.plot_id} (Block {self.block.block_name}) - {self.status}"



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
    date_registered = models.DateField(auto_now_add=True)

    MODE_OF_PAYMENT_CHOICES = [
        ('cash', 'Cash'),
        ('installments', 'Installments'),
    ]
    mode_of_payment = models.CharField(max_length=20, choices=MODE_OF_PAYMENT_CHOICES, default='cash')
    balance_to_pay = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    plot = models.ForeignKey(Plot, on_delete=models.SET_NULL, null=True, blank=True)
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name='clients')
    payment_status = models.CharField(max_length=10, choices=[
        ('unpaid', 'Unpaid'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
    ], default='unpaid')

    def update_payment_status(self):
        """Update the payment status based on balance."""
        if self.balance_to_pay == 0:
            self.payment_status = 'paid'
        elif self.balance_to_pay > 0 and self.balance_to_pay < self.plot.price:
            self.payment_status = 'partial'
        else:
            self.payment_status = 'unpaid'
        self.save()

    def __str__(self):
        return f"{self.id} - {self.first_name} {self.last_name} ({self.payment_status})"
    

class PendingRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
        ('confirmed', 'Confirmed'),
        ('voided', 'Voided'),
    ]

    PAYMENT_CHOICES = [
        ('partial', 'Partial Payment'),
        ('full', 'Full Payment'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected'),
    ]

    id = models.AutoField(primary_key=True)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='pending_requests')
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    client_phone = models.CharField(max_length=15, blank=True, null=True)
    plot = models.ForeignKey(Plot, on_delete=models.CASCADE, related_name='pending_requests')
    payment_type = models.CharField(max_length=10, choices=PAYMENT_CHOICES)
    declared_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total cost of the plot")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    submission_deadline = models.DateTimeField() 
    message = models.TextField(blank=True, null=True) 
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def confirm_request(self):
        """Confirm the request and handle client and plot assignments."""
        if self.plot.status != 'vacant':
            raise ValueError("Plot is not available.")
        

        remaining_balance = self.total_price - self.declared_amount
        if self.payment_type == 'full' and remaining_balance != 0:
            raise ValueError("Declared amount does not match the total price for full payment.")
        elif self.payment_type == 'partial' and remaining_balance <= 0:
            raise ValueError("Declared amount exceeds the total price for partial payment.")


        client, created = Client.objects.update_or_create(
            email_address=self.client_email,
            defaults={
                'first_name': self.client_name.split()[0],
                'last_name': self.client_name.split()[-1],
                'contact_no': self.client_phone,
                'plot': self.plot,
                'balance_to_pay': remaining_balance,
                'agent': self.agent,
            },
        )
        client.update_payment_status()


        if remaining_balance == 0:
            self.plot.assign_owner(client)
        else:
            self.plot.status = 'reserved'
            self.plot.save()

        self.status = 'confirmed'
        self.payment_status = 'pending'
        self.reviewed_at = datetime.datetime.now()
        self.save()

    def __str__(self):
        return f"Request {self.id} - {self.status} by Agent {self.agent.first_name} {self.agent.last_name}"


class PaymentSubmission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('paid', 'Paid'),
        ('voided', 'Voided'),
    ]

    id = models.AutoField(primary_key=True)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='payment_submissions')
    request = models.OneToOneField(PendingRequest, on_delete=models.CASCADE, related_name='payment_submission')
    declared_amount = models.DecimalField(max_digits=10, decimal_places=2)
    submission_deadline = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    actual_payment_received = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    submission_date = models.DateTimeField(null=True, blank=True)

    def mark_as_accepted(self):
        """Mark the request as accepted and notify the agent."""
        self.status = 'accepted'
        self.save()


    def mark_as_paid(self, actual_amount):
        """Mark the request as paid and confirm the payment amount."""
        self.status = 'paid'
        self.actual_payment_received = actual_amount
        self.save()

    def mark_as_voided(self):
        """Void the reservation if the deadline is missed."""
        self.status = 'voided'
        self.save()

    def __str__(self):
        return f"Payment Submission for {self.request} - Status: {self.status}"