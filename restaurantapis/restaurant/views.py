from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Sum, Avg, Q
from django.contrib.auth.hashers import make_password

from restaurant import serializers, paginators
from .models import Category, Dish, User, Review, Order, Like, Tag

class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.AllowAny]


class DishView(viewsets.ModelViewSet):
    queryset = Dish.objects.prefetch_related('tags').select_related('chef', 'category').filter(active=True)
    serializer_class = serializers.DishDetailSerializer
    pagination_class = paginators.DishPaginator
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        query = self.queryset
        
        # Search by dish name
        q = self.request.query_params.get('q')
        if q:
            query = query.filter(name__icontains=q)

        # Filter by category
        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)
        
        # Filter by chef
        chef_id = self.request.query_params.get('chef_id')
        if chef_id:
            query = query.filter(chef_id=chef_id)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        if min_price:
            query = query.filter(price__gte=float(min_price))
        
        max_price = self.request.query_params.get('max_price')
        if max_price:
            query = query.filter(price__lte=float(max_price))

        # Filter by prepare time range
        min_prepare = self.request.query_params.get('min_prepare')
        if min_prepare:
            try:
                query = query.filter(prepare_time__gte=int(min_prepare))
            except ValueError:
                pass
        max_prepare = self.request.query_params.get('max_prepare')
        if max_prepare:
            try:
                query = query.filter(prepare_time__lte=int(max_prepare))
            except ValueError:
                pass
        
        # Ordering
        ordering = self.request.query_params.get('ordering', 'name')
        if ordering in ['name', '-name', 'price', '-price', 'prepare_time', '-prepare_time']:
            query = query.order_by(ordering)
        elif ordering in ['rating', '-rating']:
            query = query.annotate(rating=Avg('review__rating')).order_by(ordering)

        return query

    @action(detail=False, methods=['post'], url_path='compare')
    def compare_dishes(self, request):
        """Compare multiple dishes"""
        dish_ids = request.data.get('dish_ids', [])
        dishes = Dish.objects.filter(id__in=dish_ids, active=True)
        serializer = self.get_serializer(dishes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='like')
    def like(self, request, pk=None):
        """Like/unlike a dish"""
        dish = self.get_object()
        user = request.user if request.user.is_authenticated else None
        
        if not user:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        like, created = Like.objects.get_or_create(user=user, dish=dish)
        if not created:
            like.delete()
            return Response({'detail': 'Unliked'}, status=status.HTTP_200_OK)
        
        return Response({'detail': 'Liked'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='reviews')
    def reviews_list(self, request, pk=None):
        """Get all reviews for a dish"""
        dish = self.get_object()
        reviews = Review.objects.filter(dish=dish, active=True)
        serializer = serializers.ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='reviews')
    def reviews_create(self, request, pk=None):
        """Create a review for a dish"""
        dish = self.get_object()
        user = request.user if request.user.is_authenticated else None
        
        if not user:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = serializers.ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, dish=dish)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='reviews/(?P<review_id>[^/.]+)')
    def reviews_partial_update(self, request, pk=None, review_id=None):
        """Update a review"""
        try:
            review = Review.objects.get(id=review_id, dish_id=pk)
            if request.user.is_authenticated and review.user == request.user:
                serializer = serializers.ReviewSerializer(review, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        except Review.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class OrderView(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = serializers.OrderSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_order(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        order.active = False
        order.save()
        return Response({'detail': 'Order cancelled'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='checkout')
    def checkout(self, request, pk=None):
        """Checkout an order"""
        order = self.get_object()
        # Add checkout logic here
        return Response({'detail': 'Order checked out', 'order_id': order.id}, status=status.HTTP_200_OK)


class ReviewView(viewsets.ModelViewSet):
    queryset = Review.objects.filter(active=True)
    serializer_class = serializers.ReviewSerializer
    permission_classes = [permissions.AllowAny]


class UserView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'], url_path='')
    def create_user(self, request):
        """Register a new user"""
        serializer = serializers.UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = User(**serializer.validated_data)
            user.password = make_password(serializer.validated_data['password'])
            user.save()
            return Response(serializers.UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='current-user')
    def current_user(self, request):
        """Get current user info"""
        if request.user.is_authenticated:
            serializer = serializers.UserSerializer(request.user)
            return Response(serializer.data)
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['patch'], url_path='current-user')
    def update_current_user(self, request):
        """Update current user info"""
        if request.user.is_authenticated:
            serializer = serializers.UserSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


class StatsView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'], url_path='revenue')
    def revenue_stats(self, request):
        """Get revenue statistics"""
        total_revenue = Order.objects.filter(active=True).aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.filter(active=True).count()
        
        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'average_order': total_revenue / total_orders if total_orders > 0 else 0
        })


class ChefView(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.filter(role=User.Role.CHEF, is_active=True)
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.AllowAny]

