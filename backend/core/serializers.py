from rest_framework import serializers
from .models import Profile, EmployeeDetails, AgentDetails, ClientDetails, Block, Plot


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

    class Meta:
        model = Plot
        fields = [
            'plot_id', 'plot_name', 'plot_type', 'status', 'purchase_date',
            'owner', 'owner_name', 'block', 'block_name',
            'latitude', 'longitude', 'max_bodies', 'price'
        ]

    def get_price(self, obj):
        return obj.get_price()
