from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.core.validators import RegexValidator

# Create your models here.

def upload_to(instance, filename):
    return f"profile_pics/{instance.id}/{filename}"


class User(AbstractBaseUser, PermissionsMixin):
    ACCOUNT_TYPES = (
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('agent', 'Agent'),
        ('info_officer', 'Information Officer'),
        ('cashier', 'Cashier'),
    )

    phone_number_validator = RegexValidator(
        regex=r'^\+63 \d{3}-\d{3}-\d{4}$',
        message="Phone number must be in the format +63 XXX-XXX-XXXX"
    )
    
    first_name = models.CharField(_("First Name"), max_length=100)
    middle_name = models.CharField(_("Middle Name"), max_length=10)
    last_name = models.CharField(_("Last Name"), max_length=100)
    email = models.EmailField(_("Email Address"), max_length=254, unique=True)
    address = models.CharField(_("Address"), max_length=50)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined =  models.DateTimeField(auto_now_add=True)
    employee_pic = models.ImageField(upload_to=upload_to, blank=True, null=True)
    phone_number = models.CharField(
        max_length=15,  # Adjust if necessary for longer numbers
        validators=[phone_number_validator],
        unique=True,  # Optional, if you want phone numbers to be unique

    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "account_type"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.user.username
    
    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    


