from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Sum

from restaurant import serializers, paginators, perms
from .models import Category, Dish, User, Review, Order, Like


class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.AllowAny]


class DishView(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Dish.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.DishDetailSerializer
    pagination_class = paginators.DishPaginator

    def get_permissions(self):
        if self.action == 'get_reviews' and self.request.method in ['POST', 'PATCH']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def get_queryset(self):
        query = self.queryset
        q = self.request.query_params.get('q')
        if q:
            query = query.filter(name__icontains=q)

        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        return query

    @action(methods=['get', 'post', 'patch'], detail=True, url_path='reviews')
    def get_reviews(self, request, pk):
        if request.method == 'POST':
            s = serializers.ReviewSerializer(data={
                'user': request.user.pk,
                'dish': pk,
                'content': request.data['content'],
                'rating': request.data.get('rating', 5)
            })
            s.is_valid(raise_exception=True)
            r = s.save()
            return Response(serializers.ReviewSerializer(r).data, status=status.HTTP_201_CREATED)

        if request.method == 'PATCH':
            review = self.get_object().review_set.filter(user=request.user).first()
            if not review:
                return Response({"detail": "Bạn chưa đánh giá món này."}, status=status.HTTP_404_NOT_FOUND)
            s = serializers.ReviewSerializer(review, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            s.save()
            return Response(s.data, status=status.HTTP_200_OK)

        reviews = self.get_object().review_set.select_related('user').filter(active=True)
        return Response(serializers.ReviewSerializer(reviews, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path='like')
    def like(self, request, pk):
        dish = self.get_object()
        user = request.user
        like, created = Like.objects.get_or_create(user=user, dish=dish)

        if not created:
            like.delete()
            return Response({"detail": "Unliked"}, status=status.HTTP_200_OK)
        return Response(serializers.LikeSerializer(like).data, status=status.HTTP_201_CREATED)

    def get_permissions(self):
        if self.action == 'like':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class UserView(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            s = serializers.UserSerializer(user, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            s.save()

        return Response(serializers.UserSerializer(user).data, status=status.HTTP_200_OK)

class ReviewView(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Review.objects.filter(active=True)
    serializer_class = serializers.ReviewSerializer
    permission_classes = [perms.ReviewOwner]


