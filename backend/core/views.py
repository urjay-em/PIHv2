from rest_framework import viewsets
from .models import Employee, Agent, Commission, Plot, Client
from .serializers import EmployeeSerializer, AgentSerializer, CommissionSerializer, PlotSerializer, ClientSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission

def normalize_role(role):
    return role.lower()  # Normalize to lowercase

class CanAccessEmployee(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type in ['information', 'cashier']:
            return request.method in ['GET']
        return False

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, CanAccessEmployee]

class CanAccessPlot(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type in ['information', 'agent']:
            return request.method in ['GET', 'POST', 'PATCH']
        if account_type == 'client':
            return request.method == 'GET'
        return False

class PlotViewSet(viewsets.ModelViewSet):
    queryset = Plot.objects.all()
    serializer_class = PlotSerializer
    permission_classes = [IsAuthenticated, CanAccessPlot]

    def get_queryset(self):
        user = self.request.user
        account_type = normalize_role(user.account_type)
        if account_type == 'admin':
            return Plot.objects.all()
        if account_type == 'client':
            return Plot.objects.filter(owner=user.client)
        if account_type == 'agent':
            return Plot.objects.filter(owner__agent=user.agent_profile)
        return Plot.objects.none()

class CanAccessAgent(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type == 'agent':
            return request.method == 'GET'
        return False

class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated, CanAccessAgent]

class CanAccessCommission(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type == 'agent':
            return request.method == 'GET'
        return False

class CommissionViewSet(viewsets.ModelViewSet):
    queryset = Commission.objects.all()
    serializer_class = CommissionSerializer
    permission_classes = [IsAuthenticated, CanAccessCommission]

    def get_queryset(self):
        user = self.request.user
        account_type = normalize_role(user.account_type)
        if account_type == 'admin':
            return Commission.objects.all()
        if account_type == 'agent':
            return Commission.objects.filter(agent=user.agent_profile)
        return Commission.objects.none()

class CanAccessClient(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type in ['information', 'agent']:
            return request.method in ['GET', 'POST', 'PATCH']
        if account_type == 'cashier':
            return request.method == 'GET'
        if account_type == 'client':
            return request.method == 'GET'
        return False

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, CanAccessClient]

    def get_queryset(self):
        user = self.request.user
        account_type = normalize_role(user.account_type)
        if account_type == 'admin':
            return Client.objects.all()
        if account_type in ['information', 'agent']:
            return Client.objects.filter(agent=user.agent_profile)
        if account_type == 'client':
            return Client.objects.filter(id=user.client.id)
        return Client.objects.none()
