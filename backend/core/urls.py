from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileView, ProfileViewSet, EmployeeViewSet, AgentViewSet, ClientViewSet, BlockViewSet, PlotViewSet
from django.conf import settings
from django.conf.urls.static import static

# Create a router for viewsets
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'blocks', BlockViewSet, basename='blocks')
router.register(r'plots', PlotViewSet, basename='plots')


# Add router.urls to urlpatterns
urlpatterns = [
    path('', include(router.urls)),
    path("profile/<int:pk>/", ProfileView.as_view(), name="profile-detail"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)