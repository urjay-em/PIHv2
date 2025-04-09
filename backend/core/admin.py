from django.contrib import admin
from .models import EmployeeDetails, ClientDetails, AgentDetails

admin.site.register(EmployeeDetails)
admin.site.register(ClientDetails)
admin.site.register(AgentDetails)