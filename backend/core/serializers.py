from rest_framework import serializers
from .models import Employee, Agent, Commission, Plot, Client

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class AgentSerializer(serializers.ModelSerializer):
    clients = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all(), many=True)

    class Meta:
        model = Agent
        fields = ['id', 'name', 'clients']

class CommissionSerializer(serializers.ModelSerializer):
    agent = AgentSerializer(read_only=True)  # Include full details of the associated agent

    class Meta:
        model = Commission
        fields = '__all__'

class PlotSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())  # Include client ID

    class Meta:
        model = Plot
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    agent = AgentSerializer(read_only=True)
    plot = PlotSerializer(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'
