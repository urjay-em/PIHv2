# core/views.py
from rest_framework import viewsets, generics, permissions, status, serializers
from rest_framework.permissions import IsAuthenticated
from .models import Profile, EmployeeDetails, AgentDetails, ClientDetails, Block, Plot, PaymentRequest, Payment, BalanceTracker
from .serializers import ProfileSerializer, EmployeeSerializer, AgentSerializer, ClientSerializer, BlockSerializer, PlotSerializer, PaymentRequestSerializer, PaymentSerializer, BalanceTrackerSerializer
from .permissions import CanAccessEmployee, CanAccessAgent, CanAccessClient, IsAdminOrOwner, CanAccessBlock, CanAccessPlot, IsEmployee 
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.utils import normalize_role
from rest_framework.decorators import action



class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    parser_classes = [MultiPartParser, FormParser]  # ✅ Allow file uploads

    def get_object(self):
        # Fetch profile based on authenticated user
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        print("Request data:", request.data)  # ✅ Debugging data
        print("Request FILES:", request.FILES)  # ✅ Debugging file uploads

        partial = kwargs.pop('partial', True)  # ✅ Enable partial updates for PATCH
        instance = self.get_object()

        # Pass the data to the serializer
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()

            # Check if the file is actually saved
            if instance.profile_pic:
                print("File saved at:", instance.profile_pic.path)
            else:
                print("No file saved!")
            
            return Response(serializer.data, status=status.HTTP_200_OK)  # ✅ Success
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # ❌ Error
    
class ProfileViewSet(viewsets.ReadOnlyModelViewSet):  # ReadOnly = list + retrieve
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['account_type']
    search_fields = ['first_name', 'last_name', 'email']

# ============================
# Employee ViewSet
# ============================
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDetails.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Customize queryset based on user access."""
        if self.request.user.is_superuser:
            return EmployeeDetails.objects.all()
        return EmployeeDetails.objects.filter(profile__user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Extract the profile data from the request if it exists
        profile_data = request.data.get("profile", None)

        # If profile data is provided, handle it separately
        if profile_data:
            # Check if the profile exists
            if not instance.profile:
                return Response(
                    {"error": "Profile not found for the employee."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Update profile data
            profile_serializer = ProfileSerializer(instance.profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Now update the EmployeeDetails model itself
        serializer = self.get_serializer(instance, data=request.data, partial=False)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        """Save the updated instance."""
        serializer.save()

class AgentViewSet(viewsets.ModelViewSet):
    queryset = AgentDetails.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated, CanAccessAgent]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return AgentDetails.objects.all()
        return AgentDetails.objects.filter(profile__user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Extract the profile data from the request if it exists
        profile_data = request.data.get("profile", None)

        # If profile data is provided, handle it separately
        if profile_data:
            # Check if the profile exists
            if not instance.profile:
                return Response(
                    {"error": "Profile not found for the agent."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Update profile data
            profile_serializer = ProfileSerializer(instance.profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Now update the AgentDetails model itself
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # Allow partial update

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        """Save the updated instance."""
        serializer.save()


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, CanAccessClient]

    def get_queryset(self):
        """
        Return a list of all clients or the clients assigned to the logged-in user.
        """
        if self.request.user.is_superuser:
            # Superuser can see all clients
            return ClientDetails.objects.all()
        # If the user is a client, show only their own details
        return ClientDetails.objects.filter(profile__user=self.request.user)

    def perform_create(self, serializer):
        """
        This method is called when creating a new client. It automatically assigns
        the current logged-in user to the client profile.
        """
        user = self.request.user
        # You might want to create the profile if it doesn't exist or assign it.
        profile = user.profile  # Assume the profile already exists
        serializer.save(profile=profile)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Extract the profile data from the request if it exists
        profile_data = request.data.get("profile", None)

        if profile_data:
            if not instance.profile:
                return Response(
                    {"error": "Profile not found for the client."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            profile_serializer = ProfileSerializer(instance.profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    

class PaymentRequestViewSet(viewsets.ModelViewSet):
    queryset = PaymentRequest.objects.all()
    serializer_class = PaymentRequestSerializer
    permission_classes = [IsEmployee]  # Use the permission to restrict access

    # Filter by status when listing payment requests
    def get_queryset(self):
        queryset = PaymentRequest.objects.all()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    # Override perform_create to set created_by field automatically and handle payment_plan
    def perform_create(self, serializer):
        # Automatically assign the user who created the payment request
        payment_plan = self.request.data.get('payment_plan', None)
        client_id = self.request.data.get('client_id', None)  # Get client_id from the request data
        
        # Ensure client_id is provided and valid
        if not client_id:
            raise serializers.ValidationError({"error": "Client ID is required."})

        try:
            client = ClientDetails.objects.get(id=client_id)  # Get the ClientDetails instance using client_id
        except ClientDetails.DoesNotExist:
            raise serializers.ValidationError({"error": "Invalid Client ID."})

        # Ensure payment_plan is valid (it should be one of the predefined choices)
        if payment_plan not in dict(PaymentRequest.PAYMENT_PLAN_CHOICES):
            raise serializers.ValidationError({"error": "Invalid payment plan choice."})
        
        # Save the payment request with the validated client and created_by
        serializer.save(created_by=self.request.user, client=client)

    # Override the update method to handle custom logic for rejection reasons and payment_plan
    def update(self, request, *args, **kwargs):
        payment_request = self.get_object()

        # Custom validation for rejection reason and payment plan
        if payment_request.status == 'approved' and request.data.get('status') == 'rejected':
            rejection_reason = request.data.get('rejection_reason')
            if not rejection_reason:
                return Response({"error": "Rejection reason is required."}, status=status.HTTP_400_BAD_REQUEST)

        # If updating to approved, clear rejection reason
        if request.data.get('status') == 'approved':
            request.data['rejection_reason'] = None
        
        # Check and handle the payment_plan when updating
        payment_plan = request.data.get('payment_plan', None)
        if payment_plan and payment_plan not in dict(PaymentRequest.PAYMENT_PLAN_CHOICES):
            return Response({"error": "Invalid payment plan choice."}, status=status.HTTP_400_BAD_REQUEST)

        return super().update(request, *args, **kwargs)

    # Create a custom action for approve/reject logic (similar to your previous method)
    @action(detail=True, methods=['post'])
    def approve_reject(self, request, pk=None):
        try:
            payment_request = PaymentRequest.objects.get(id=pk)
        except PaymentRequest.DoesNotExist:
            return Response({"error": "Payment Request not found"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')  # 'approve' or 'reject'
        rejection_reason = request.data.get('rejection_reason', None)

        if action not in ['approve', 'reject']:
            return Response({"error": "Invalid action. Choose 'approve' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'reject' and not rejection_reason:
            return Response({"error": "Rejection reason is required when rejecting."}, status=status.HTTP_400_BAD_REQUEST)

        # Update status and rejection_reason accordingly
        if action == 'approve':
            payment_request.status = 'approved'
            payment_request.rejection_reason = None  # Clear any rejection reason
        elif action == 'reject':
            payment_request.status = 'rejected'
            payment_request.rejection_reason = rejection_reason

        payment_request.save()

        return Response(PaymentRequestSerializer(payment_request).data, status=status.HTTP_200_OK)
    
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]  # Ensure that only authenticated users can access this

    def perform_create(self, serializer):
        """Override the perform_create method to assign the current user as the creator."""
        serializer.save(created_by=self.request.user)  # Assuming 'created_by' is a user field

class BalanceTrackerViewSet(viewsets.ModelViewSet):
    queryset = BalanceTracker.objects.all()
    serializer_class = BalanceTrackerSerializer

    # To retrieve the balance for a specific client and plot combination
    def get_queryset(self):
        client_id = self.request.query_params.get('client', None)
        plot_id = self.request.query_params.get('plot', None)
        paymentrequest_id = self.request.query_params.get('paymentrequest', None)  # added this line
        
        queryset = BalanceTracker.objects.all()  # Base queryset
        
        if client_id and plot_id:
            queryset = queryset.filter(client_id=client_id, plot_id=plot_id)
        
        if paymentrequest_id:
            queryset = queryset.filter(paymentrequest_id=paymentrequest_id)  # Filter by paymentrequest_id
        
        return queryset

       # Custom action to get the balance summary (this is optional, just an example)
    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        balance_tracker = self.get_object()
        data = {
            "client_id": balance_tracker.client.id,
            "plot_id": balance_tracker.plot.id,
            "paymentrequest_id": balance_tracker.paymentrequest.id,  # Added this line
            "total_price": balance_tracker.total_price,
            "total_paid": balance_tracker.total_paid,
            "remaining_balance": balance_tracker.remaining_balance,
            "payments_made": balance_tracker.payments_made,
            "payment_plan": balance_tracker.payment_plan 
        }
        return Response(data)

    # You can also add custom actions for specific payment-related processes