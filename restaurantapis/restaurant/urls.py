from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from . import views

r = DefaultRouter()
r.register('categories', views.CategoryView, basename='category')
r.register('dishes', views.DishView, basename='dish')
r.register('orders', views.OrderView, basename='order')
r.register('reviews', views.ReviewView, basename='review')
r.register('users', views.UserView, basename='user')
r.register('stats', views.StatsView, basename='stats')
r.register('chefs', views.ChefView, basename='chef')

urlpatterns = [
    path('', include(r.urls)),
]