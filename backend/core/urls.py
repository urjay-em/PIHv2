from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, AgentViewSet, CommissionViewSet, BlockViewSet, PriceViewSet, PlotViewSet, ClientViewSet

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'commissions', CommissionViewSet, basename='commission')
router.register(r'blocks', BlockViewSet, basename='block')
router.register(r'prices', PriceViewSet, basename='price')
router.register(r'plots', PlotViewSet, basename='plot')
router.register(r'clients', ClientViewSet, basename='client')

urlpatterns = [
    path('', include(router.urls)),
]