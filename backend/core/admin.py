from django.contrib import admin
from .models import Employee, Client, Agent, Plot, Commission

admin.site.register(Employee)
admin.site.register(Client)
admin.site.register(Agent)
admin.site.register(Plot)
admin.site.register(Commission)
