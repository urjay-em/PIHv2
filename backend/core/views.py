# core/views.py
from rest_framework import viewsets, generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from .models import Profile, EmployeeDetails, AgentDetails, ClientDetails, Block, Plot
from .serializers import ProfileSerializer, EmployeeSerializer, AgentSerializer, ClientSerializer, BlockSerializer, PlotSerializer
from .permissions import CanAccessEmployee, CanAccessAgent, CanAccessClient, IsAdminOrOwner, CanAccessBlock, CanAccessPlot
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


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