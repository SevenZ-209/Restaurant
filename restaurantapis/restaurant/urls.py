from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from . import views

r = DefaultRouter()
r.register('categories', views.CategoryView, basename='category')
r.register('dishes', views.DishView, basename='dish')
r.register('users', views.UserView, basename='user')
r.register('reviews', views.ReviewView, basename='review')
r.register('orders', views.OrderView, basename='order')
r.register('tags', views.TagView, basename='tags')
r.register('tables', views.TableView, basename='tables')
urlpatterns = [
    path('', include(r.urls)),

]