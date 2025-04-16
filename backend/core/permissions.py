# core/permissions.py
from rest_framework.permissions import BasePermission
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from core.utils import normalize_role



def normalize_role(role):
    """Normalize account type to lowercase."""
    return role.lower() if role else ''


class IsAdminOrOwner(permissions.BasePermission):
    """
    Allow only the owner of the profile or admin to modify address and contact_no.
    """

    def has_object_permission(self, request, view, obj):
        # Allow read-only access for GET, HEAD, or OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the user is an admin or the profile owner
        return request.user.is_staff or obj.user == request.user


# ============================
# CanAccessEmployee Permission
# ============================
class CanAccessEmployee(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type in ['information', 'cashier']:
            if request.method == 'GET':
                return True

        # Permission Denied
        raise PermissionDenied({"detail": "You do not have permission to access employee records."})


# ============================
# CanAccessAgent Permission
# ============================
class CanAccessAgent(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type in ['agent', 'information']:
            if request.method == 'GET':
                return True

        raise PermissionDenied({"detail": "You do not have permission to access agent data."})


# ============================
# CanAccessClient Permission
# ============================
class CanAccessClient(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)

        # Admin has full access
        if account_type == 'admin':
            return True

        # Information and Agent can GET, POST, and PATCH
        if account_type in ['information', 'agent']:
            if request.method in ['GET', 'POST', 'PATCH']:
                return True

        # Cashier and Client have GET-only access
        if account_type in ['cashier', 'client']:
            if request.method == 'GET':
                return True

        raise PermissionDenied({"detail": "Permission denied. Contact admin if you believe this is a mistake."})

class CanAccessBlock(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type in ['information', 'agent']:
            return request.method in ['GET', 'POST', 'PATCH']
        return False

class CanAccessPlot(BasePermission):
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        if account_type == 'admin':
            return True
        if account_type in ['information', 'agent']:
            return request.method in ['GET', 'POST', 'PATCH']
        if account_type == 'client':
            return request.method == 'GET'
        return False
    
class IsEmployee(BasePermission):
    """
    Allow access only to users with account_type 'admin', 'cashier', or 'information'.
    """
    def has_permission(self, request, view):
        account_type = normalize_role(request.user.account_type)
        
        # Check if account type is 'admin', 'cashier', or 'information'
        if account_type in ['admin', 'cashier', 'information']:
            return True

        # If permission is denied, raise PermissionDenied exception
        raise PermissionDenied({"detail": "You do not have permission to access this resource."})