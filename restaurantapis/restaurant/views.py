from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Sum

from restaurant import serializers, paginators
from .models import Category, Dish, User, Review, Order

class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.AllowAny]


class DishView(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Dish.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.DishDetailSerializer
    pagination_class = paginators.DishPaginator

    def get_queryset(self):
        query = self.queryset
        q = self.request.query_params.get('q')
        if q:
            query = query.filter(name__icontains=q)

        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        return query

