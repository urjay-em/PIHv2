from rest_framework import viewsets
from .models import Employee, Agent, Commission, Block, Price, Plot, Client, PendingRequest
from .serializers import EmployeeSerializer, AgentSerializer, CommissionSerializer, BlockSerializer, PriceSerializer, PlotSerializer, ClientSerializer, PendingRequestSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
import datetime

def normalize_role(role):
    return role.lower()

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
    
class CanAccessBlock(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type in ['information', 'agent']:
            return request.method in ['GET', 'POST', 'PATCH']
        return False

class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all()
    serializer_class = BlockSerializer
    permission_classes = [IsAuthenticated, CanAccessBlock]

    def get_queryset(self):
        user = self.request.user
        account_type = normalize_role(user.account_type)
        if account_type == 'admin':
            return Block.objects.all()
        if account_type in ['agent', 'information']:
            return Block.objects.all()
        return Block.objects.none()

    def destroy(self, request, *args, **kwargs):
        account_type = normalize_role(request.user.account_type)
        if account_type in ['agent', 'information']:
            return Response({"detail": "You do not have permission to delete."}, status=403)
        return super().destroy(request, *args, **kwargs)


class PlotViewSet(viewsets.ModelViewSet):
    queryset = Plot.objects.all()
    serializer_class = PlotSerializer
    permission_classes = [IsAuthenticated, CanAccessPlot]

    def get_queryset(self):
        user = self.request.user
        account_type = normalize_role(user.account_type)
        if account_type == 'admin':
            return Plot.objects.all()
        if account_type in ['agent', 'information']:
            return Plot.objects.all()
        if account_type == 'client':
            return Plot.objects.filter(owner=user.client)
        return Plot.objects.none()

    def destroy(self, request, *args, **kwargs):
        account_type = normalize_role(request.user.account_type)
        if account_type in ['agent', 'information']:
            return Response({"detail": "You do not have permission to delete."}, status=403)
        return super().destroy(request, *args, **kwargs)


class CanAccessAgent(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True 
        if account_type in ['agent', 'information']: 
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
        
        # Admin has full access
        if account_type == 'admin':
            return True
        
        # Information and Agent can GET, POST, and PATCH
        if account_type in ['information', 'agent']:
            return request.method in ['GET', 'POST', 'PATCH']
        
        # Cashier has GET-only access
        if account_type == 'cashier':
            return request.method == 'GET'
        
        # Client has GET-only access
        if account_type == 'client':
            return request.method == 'GET'
        
        # Default to deny
        return False


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, CanAccessClient]

    def get_queryset(self):
        user = self.request.user
        account_type = normalize_role(user.account_type)
        
        # Admin can access all clients
        if account_type == 'admin':
            return Client.objects.all()
        
        # Information and Agent can access clients they manage
        if account_type in ['information', 'agent']:
            return Client.objects.filter(agent=user.agent_profile)
        
        # Client can only access their own information
        if account_type == 'client':
            return Client.objects.filter(id=user.client.id)
        
        # Default to no access
        return Client.objects.none()



def send_payment_deadline_notification(agent, pending_request):
    subject = "Payment Deadline Notification"
    message = f"Dear {agent.first_name},\n\nYour reservation for Plot {pending_request.plot.plot_id} has been accepted. Please ensure that you submit the payment at our office by {pending_request.submission_deadline}. Failure to meet the deadline will void your reservation."
    send_mail(subject, message, 'from@example.com', [agent.email_address])

def send_successful_purchase_notification(client):
    subject = "Successful Plot Purchase"
    message = f"Dear {client.first_name},\n\nCongratulations! You have successfully purchased Plot {client.plot.plot_id}. Please proceed to the main office for paperwork (Deed of Sale, Lot Title, Notary)."
    send_mail(subject, message, 'from@example.com', [client.email_address])

class PendingRequestViewSet(viewsets.ModelViewSet):
    queryset = PendingRequest.objects.all()
    serializer_class = PendingRequestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def confirm_request(self, request, pk=None):
        try:
            pending_request = self.get_object()

            pending_request.confirm_request()

            send_payment_deadline_notification(pending_request.agent, pending_request)

            if pending_request.payment_status == 'accepted' and pending_request.declared_amount == pending_request.total_price:
                send_successful_purchase_notification(pending_request.client)

            return Response({'status': 'Request confirmed, notifications sent.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer

    @action(detail=False, methods=['get'])
    def get_price_by_type(self, request):
        plot_type = request.query_params.get('plot_type', None)
        if plot_type:
            try:
                price_entry = Price.objects.get(plot_type=plot_type)
                return Response({'price': price_entry.price})
            except Price.DoesNotExist:
                return Response({'price': 0}, status=404)
        return Response({'error': 'plot_type is required'}, status=400)