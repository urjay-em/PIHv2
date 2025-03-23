from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.core.validators import RegexValidator

# Create your models here.


class User(AbstractBaseUser, PermissionsMixin):
    ACCOUNT_TYPES = (
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('agent', 'Agent'),
        ('information', 'Information Officer'),
        ('cashier', 'Cashier'),
    )
    
    phone_number_validator = RegexValidator(
        regex=r'^\+63 \d{3}-\d{3}-\d{4}$',
        message="Phone number must be in the format +63 XXX-XXX-XXXX"
    )

    first_name = models.CharField(_("First Name"), max_length=100)
    last_name = models.CharField(_("Last Name"), max_length=100)
    email = models.EmailField(_("Email Address"), max_length=254, unique=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined =  models.DateTimeField(auto_now_add=True)
    phone_number = models.CharField(
        max_length=16,
        validators=[phone_number_validator],
        unique=True,
        null=True, 
        blank=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "account_type", "phone_number"]


    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.email
    
    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"