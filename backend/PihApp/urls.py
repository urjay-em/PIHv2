from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from users.serializers import CustomTokenObtainPairSerializer
from users.views import MyTokenObtainPairView, MyTokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from users.views import UserProfileView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/v1/auth/jwt/create/', CustomTokenObtainPairView.as_view(), name='jwt-create'),
    path("api/v1/auth/", include('djoser.urls')),
    path("api/v1/auth/", include('djoser.urls.jwt')),


    # core'
    path('api/v1/', include('core.urls')),

    #user
    path('api/v1/user/profile/', UserProfileView.as_view(), name="profile"),
    #path('api/v1/profile/update', UpdateUserProfileView.as_view(), name="profile-update"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)