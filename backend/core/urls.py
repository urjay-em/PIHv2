from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileView,  EmployeeViewSet, AgentViewSet, ClientViewSet
from django.conf import settings
from django.conf.urls.static import static

# Create a router for viewsets
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'clients', ClientViewSet, basename='client')

# Add router.urls to urlpatterns
urlpatterns = [
    path('', include(router.urls)),
    path("profile/<int:pk>/", ProfileView.as_view(), name="profile-detail"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)