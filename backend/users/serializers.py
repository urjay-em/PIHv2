from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password','account_type']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        print("Account Type:", user.account_type)
        # Add the 'account_type' to the token
        token['account_type'] = user.account_type  # Ensure 'account_type' is present in the user model
        # Add user's first and last name to the token
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token