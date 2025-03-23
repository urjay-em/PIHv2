from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


User = get_user_model()


class CreateUserSerializer(UserCreateSerializer):
    re_password = serializers.CharField(write_only=True, required=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 're_password', 'account_type', 'phone_number']
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        """Email must be unique."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate_phone_number(self, value):
        """Phone number must be unique."""
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("This phone number is already registered.")
        return value

    def validate_account_type(self, value):
        """Validate account type."""
        valid_account_types = ['client', 'admin', 'agent', 'cashier', 'information']

        if not value:
            raise serializers.ValidationError("Account type is required and cannot be empty.")
        
        if value not in valid_account_types:
            raise serializers.ValidationError(f"Invalid account type. Valid types are: {', '.join(valid_account_types)}")
        return value

    def validate(self, data):
        """Check if password and re_password match."""
        password = data.get("password")
        re_password = data.get("re_password")

        if password != re_password:
            raise serializers.ValidationError({"re_password": "Passwords do not match."})

        return data

    def create(self, validated_data):
        """Remove re_password before saving."""
        validated_data.pop("re_password", None)
        user = super().create(validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        print("Account Type:", user.account_type)

        token['account_type'] = user.account_type  
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['phone_number'] = user.phone_number

        
        return token
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}