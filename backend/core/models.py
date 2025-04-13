# core/models.py
from django.db import models
from django.conf import settings
from datetime import date

def upload_to(instance, filename):
    return f"profile_pics/{instance.user.id}/{filename}" 

class Profile(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    ACCOUNT_TYPE_CHOICES = [
        ('admin', 'Admin'),
        ('information', 'Information Officer'),
        ('cashier', 'Cashier'),
        ('agent', 'Agent'),
        ('client', 'Client'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=30, blank=True, null=True)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, blank=True, null=True)
    email = models.EmailField(max_length=254, blank=True, null=True)
    phone_number = models.CharField(max_length=16, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_pic = models.ImageField(upload_to=upload_to, blank=True, null=True)
    date_registered = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.account_type}"

    @property
    def full_name(self):
        middle = f" {self.middle_name}" if self.middle_name else ""
        return f"{self.first_name}{middle} {self.last_name}"

    @property
    def is_adult(self):
        """Check if the user is 18+."""
        return self.age >= 18 if self.age else False

    def calculate_profile_age(self):
        """Returns the number of days since profile was registered."""
        return (date.today() - self.date_registered).days



# ================================
# Employee Details Model
# ================================
class EmployeeDetails(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='employee_details')
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    hire_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.full_name} - Employee"


# ================================
# Agent Details Model
# ================================
class AgentDetails(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='agent_details')
    hire_date = models.DateField(auto_now_add=True)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    clients_managed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.profile.full_name} - Agent"


# ================================
# Client Details Model
# ================================
class ClientDetails(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='client_details')
    occupation = models.CharField(max_length=100, blank=True, null=True)  # Optional occupation field
    last_updated = models.DateTimeField(auto_now=True)  # Automatically updates when the client details are changed
    
    # Link the client to the agent based on account_type, but handle this logic programmatically
    # by filtering Profile with account_type='agent'
    agent = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='clients', blank=True, null=True)  # Optional reference to the agent managing the client

    def __str__(self):
        return f"{self.profile.full_name} - Client"

    def save(self, *args, **kwargs):
        # Don’t auto-assign agents; assume it’s handled externally when needed
        super().save(*args, **kwargs)


class Block(models.Model):
    block_name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    coordinates = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.block_name

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
    owner = models.ForeignKey('ClientDetails', on_delete=models.SET_NULL, related_name='plots', null=True, blank=True)
    
    block = models.ForeignKey('Block', on_delete=models.CASCADE, related_name='plots', null=True)
    

    max_bodies = models.PositiveIntegerField(default=2)


    plot_name = models.CharField(max_length=255, blank=False, null=False) 
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def get_price(self):
        static_prices = {
            'stone': 50000,
            'lawn': 35000,
            'valor': 75000,
            'mausoleum': 150000,
        }
        return static_prices.get(self.plot_type, 0)


    class Meta:
        unique_together = ('plot_id', 'block')
        ordering = ['block', 'plot_id']

    def assign_owner(self, client):
        """Assign a client as the owner of this plot."""
        if self.status == 'vacant':
            self.owner = client
            self.status = 'occupied'
            self.purchase_date = date.today()
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