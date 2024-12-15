from rest_framework import serializers
from .models import Employee, Agent, Commission, Plot, Client, PendingRequest, PaymentSubmission, Transaction

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'

class CommissionSerializer(serializers.ModelSerializer):
    agent = AgentSerializer(read_only=True)

    class Meta:
        model = Commission
        fields = '__all__'

class PlotSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())

    class Meta:
        model = Plot
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    agent = AgentSerializer(read_only=True)
    plot = PlotSerializer(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'

class PendingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingRequest
        fields = '__all__'

class PaymentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSubmission
        fields = '__all__' 

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'