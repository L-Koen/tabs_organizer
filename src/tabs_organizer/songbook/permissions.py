from rest_framework.permissions import SAFE_METHODS, BasePermission


class ReadOnlyOrAuthenticated(BasePermission):
    """
    Custom permission to allow read-only access for unauthenticated users,
    and write access for authenticated users.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
