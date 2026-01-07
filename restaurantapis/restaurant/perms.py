from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated

from restaurant.models import User


class ReviewOwner(IsAuthenticated):
    def has_object_permission(self, request, view, review):
        return super().has_permission(request, view) and request.user == review.user

class IsChefOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Role.CHEF)

    def has_object_permission(self, request, view, obj):
        return obj.chef == request.user