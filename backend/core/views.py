# core/views.py
from rest_framework import viewsets, generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from .models import Profile, EmployeeDetails, AgentDetails, ClientDetails
from .serializers import ProfileSerializer, EmployeeSerializer, AgentSerializer, ClientSerializer
from .permissions import CanAccessEmployee, CanAccessAgent, CanAccessClient, IsAdminOrOwner
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response


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
        # Do not remove the profile from the data
        serializer = self.get_serializer(instance, data=request.data, partial=False)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        """Save the updated instance."""
        serializer.save()
        
class AgentViewSet(viewsets.ModelViewSet):
    serializer_class = AgentSerializer
    permission_classes = [IsAuthenticated, CanAccessAgent]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return AgentDetails.objects.all()
        return AgentDetails.objects.filter(profile__user=self.request.user)

class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, CanAccessClient]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return ClientDetails.objects.all()
        return ClientDetails.objects.filter(profile__user=self.request.user)
