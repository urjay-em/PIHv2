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
# Client Details Model
# ================================
class ClientDetails(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='client_details')
    balance_to_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=10, choices=[
        ('unpaid', 'Unpaid'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
    ], default='unpaid')

    def __str__(self):
        return f"{self.profile.full_name} - Client"



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

