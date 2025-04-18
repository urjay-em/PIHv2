from rest_framework import serializers
from .models import Profile, EmployeeDetails, AgentDetails, ClientDetails, Block, Plot, PaymentRequest, Payment, BalanceTracker
import logging

logger = logging.getLogger(__name__)


class ProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(use_url=True)

    class Meta:
        model = Profile
        fields = "__all__"

    def update(self, instance, validated_data):
        # Pop the profile data and safely update the profile instance
        profile_data = validated_data.pop('profile', None)
        if profile_data:
            # Update Profile fields if provided
            for attr, value in profile_data.items():
                setattr(instance, attr, value if value is not None else getattr(instance, attr))
            instance.save()

        # Now update the EmployeeDetails fields (this works on the model you are serializing)
        return super().update(instance, validated_data)



class EmployeeSerializer(serializers.ModelSerializer):
    # Flattened Profile fields
    first_name = serializers.CharField(source="profile.first_name", required=False, allow_null=True)
    middle_name = serializers.CharField(source="profile.middle_name", required=False, allow_null=True)
    last_name = serializers.CharField(source="profile.last_name", required=False, allow_null=True)
    full_name = serializers.SerializerMethodField()
    age = serializers.IntegerField(source="profile.age", required=False, allow_null=True)
    gender = serializers.CharField(source="profile.gender", required=False, allow_null=True)
    email = serializers.EmailField(source="profile.email", required=False, allow_null=True)
    phone_number = serializers.CharField(source="profile.phone_number", required=False, allow_null=True)
    address = serializers.CharField(source="profile.address", required=False, allow_null=True)
    profile_pic = serializers.ImageField(source="profile.profile_pic", required=False, allow_null=True)
    account_type = serializers.CharField(source="profile.account_type", required=False, allow_null=True)

    # EmployeeDetails fields
    hire_date = serializers.DateField(read_only=True)  # typically not updated manually
    salary = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = EmployeeDetails
        fields = [
            "id",  # <- this refers to EmployeeDetails.id
            "first_name", "middle_name", "last_name", "full_name", "age", "gender",
            "email", "phone_number", "address", "profile_pic",
            "account_type", "hire_date", "salary",
        ]

    def get_full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.first_name or ''} {obj.profile.last_name or ''}".strip()
        return "N/A"

    def update(self, instance, validated_data):
        # Extract and update Profile data
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        # Update EmployeeDetails fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class AgentSerializer(serializers.ModelSerializer):
    #id = serializers.IntegerField(source="profile.id", read_only=True)
    first_name = serializers.CharField(source="profile.first_name")
    middle_name = serializers.CharField(source="profile.middle_name", required=False, allow_null=True)
    last_name = serializers.CharField(source="profile.last_name")
    full_name = serializers.CharField(source="profile.full_name", read_only=True)
    age = serializers.IntegerField(source="profile.age", required=False, allow_null=True)
    gender = serializers.CharField(source="profile.gender", required=False, allow_null=True)
    contact_no = serializers.CharField(source="profile.phone_number")  # Consistency with 'phone_number'
    email_address = serializers.EmailField(source="profile.email")
    address = serializers.CharField(source="profile.address")
    profile_pic = serializers.ImageField(source="profile.profile_pic", required=False, allow_null=True)
    account_type = serializers.CharField(source="profile.account_type", required=False, allow_null=True)

    hire_date = serializers.DateField()
    commission_rate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    clients_managed = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = AgentDetails
        fields = [
            "id", "first_name", "middle_name", "last_name", "full_name",
            "age", "gender", "contact_no", "email_address", "address",
            "profile_pic", "account_type", "hire_date", "commission_rate", 
            "clients_managed"
        ]

    '''def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        if profile:
            for attr, value in profile_data.items():
                setattr(profile, attr, value if value is not None else getattr(profile, attr))
            profile.save()

        return super().update(instance, validated_data)'''

class ClientSerializer(serializers.ModelSerializer):
    # Linking profile fields
    first_name = serializers.CharField(source="profile.first_name")
    middle_name = serializers.CharField(source="profile.middle_name", required=False, allow_null=True)
    last_name = serializers.CharField(source="profile.last_name")
    full_name = serializers.CharField(source="profile.full_name", read_only=True)
    age = serializers.IntegerField(source="profile.age", required=False, allow_null=True)
    gender = serializers.CharField(source="profile.gender", required=False, allow_null=True)
    email = serializers.EmailField(source="profile.email")
    phone_number = serializers.CharField(source="profile.phone_number")
    address = serializers.CharField(source="profile.address")
    profile_pic = serializers.ImageField(source="profile.profile_pic", required=False)
    account_type = serializers.CharField(source="profile.account_type", required=False, allow_null=True)
    date_registered = serializers.DateField(source="profile.date_registered", read_only=True)

    # Use agent ID, not full name
    agent = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.filter(account_type="agent"),
        required=False,
        allow_null=True
    )



    # Fields from ClientDetails
    occupation = serializers.CharField()
    last_updated = serializers.DateTimeField(read_only=True)

    class Meta:
        model = ClientDetails
        fields = [
            "id", "first_name", "middle_name", "last_name", "full_name", "age","gender",
            "email", "phone_number", "address", "profile_pic", "account_type",
            "date_registered", "occupation", "last_updated",
            "agent"
        ]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})
        profile = instance.profile

        # Update Profile fields
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        # Update ClientDetails fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = '__all__'


class PlotSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.profile.full_name', read_only=True)
    block_name = serializers.CharField(source='block.block_name', read_only=True)
    price = serializers.SerializerMethodField()

    # Write-only field for assigning a client to the owner
    client_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Plot
        fields = [
            'plot_id', 'plot_name', 'plot_type', 'status', 'purchase_date',
            'client_id', 'owner_name', 'block', 'block_name',
            'latitude', 'longitude', 'max_bodies', 'price'
        ]
        extra_kwargs = {
            'owner': {'read_only': True},
        }

    def get_price(self, obj):
        return obj.get_price()

    def create(self, validated_data):
        client_id = validated_data.pop('client_id', None)
        if client_id:
            try:
                client = ClientDetails.objects.get(id=client_id)
                validated_data['owner'] = client
            except ClientDetails.DoesNotExist:
                raise serializers.ValidationError({'client_id': 'Client with this ID does not exist.'})
        return super().create(validated_data)

    def update(self, instance, validated_data):
        client_id = validated_data.pop('client_id', None)
        if client_id:
            try:
                client = ClientDetails.objects.get(id=client_id)
                validated_data['owner'] = client
            except ClientDetails.DoesNotExist:
                raise serializers.ValidationError({'client_id': 'Client with this ID does not exist.'})
        return super().update(instance, validated_data)
    
    
class PaymentRequestSerializer(serializers.ModelSerializer):
    plot_id = serializers.IntegerField()  # plot_id will be used to reference the plot instance
    client_id = serializers.IntegerField()  # Add client_id to be used to reference the client instance
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = PaymentRequest
        fields = ['id', 'plot_id', 'client_id', 'price', 'payment_plan', 'status', 'rejection_reason', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        plot_id = validated_data.get('plot_id')  # Safely get the plot_id
        client_id = validated_data.get('client_id')  # Get client_id for reference

        if not plot_id:
            raise serializers.ValidationError({"error": "Plot ID is required."})

        if not client_id:
            raise serializers.ValidationError({"error": "Client ID is required."})

        # Query the Plot object using plot_id
        try:
            plot = Plot.objects.get(plot_id=plot_id)
        except Plot.DoesNotExist:
            raise serializers.ValidationError({"error": "Invalid Plot ID."})

        # Query the Client object using client_id
        try:
            client = ClientDetails.objects.get(id=client_id)
        except ClientDetails.DoesNotExist:
            raise serializers.ValidationError({"error": "Invalid Client ID."})

        validated_data['plot'] = plot  # Set the plot instance in validated_data
        validated_data['client'] = client  # Set the client instance in validated_data

        return super().create(validated_data)  # Call the parent create method to save the instance

    def update(self, instance, validated_data):
        plot_id = validated_data.get('plot_id')  # Safely get plot_id for updating
        client_id = validated_data.get('client_id')  # Get client_id for updating

        if plot_id:
            try:
                plot = Plot.objects.get(plot_id=plot_id)
                instance.plot = plot  # Update the plot field in the instance
            except Plot.DoesNotExist:
                raise serializers.ValidationError({"error": "Invalid Plot ID."})

        if client_id:
            try:
                client = ClientDetails.objects.get(id=client_id)
                instance.client = client  # Update the client field in the instance
            except ClientDetails.DoesNotExist:
                raise serializers.ValidationError({"error": "Invalid Client ID."})

        return super().update(instance, validated_data)  # Call the parent update method to save changes
    

class PaymentSerializer(serializers.ModelSerializer):
    payment_request = serializers.PrimaryKeyRelatedField(queryset=PaymentRequest.objects.all())
    client = serializers.PrimaryKeyRelatedField(queryset=ClientDetails.objects.all())
    plot = serializers.PrimaryKeyRelatedField(queryset=Plot.objects.all())
    created_by = serializers.StringRelatedField()  # To display the username of the user who created the payment
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'payment_request', 'client', 'plot', 'amount', 'payment_method', 'remarks', 'created_by', 'created_at']
    
    def validate_amount(self, value):
        """Ensure that the amount is greater than 0."""
        if value <= 0:
            raise serializers.ValidationError("The payment amount must be greater than zero.")
        return value
    

class BalanceTrackerSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='client.get_full_name', read_only=True)
    
    class Meta:
        model = BalanceTracker
        fields = [
            'id', 'paymentrequest', 'client', 'plot', 'payment_plan', 'total_price', 
            'total_paid', 'remaining_balance', 'last_amount_paid', 
            'payments_made', 'last_updated', 'full_name'
        ]

    def update(self, instance, validated_data):
        # Updating the rest of the fields as needed
        logger.debug(f"Updating BalanceTracker with data: {validated_data}")
        instance.total_paid = validated_data.get('total_paid', instance.total_paid)
        instance.remaining_balance = validated_data.get('remaining_balance', instance.remaining_balance)
        instance.last_amount_paid = validated_data.get('last_amount_paid', instance.last_amount_paid)
        instance.payments_made = validated_data.get('payments_made', instance.payments_made)
        instance.save()

        return instance