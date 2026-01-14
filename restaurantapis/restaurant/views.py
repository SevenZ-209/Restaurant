from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, F, Count
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncDay, TruncMonth, TruncWeek
from django.utils import timezone

from restaurant import serializers, paginators, perms
from .models import Category, Dish, User, Review, Order, Like, OrderDetail, Tag, Table


class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.AllowAny]


class TableView(viewsets.ViewSet, generics.ListCreateAPIView, generics.DestroyAPIView):
    queryset = Table.objects.all()
    serializer_class = serializers.TableSerializer

    def get_permissions(self):
        if self.request.method in ['POST', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Table.objects.filter(active=True)


class OrderView(viewsets.ViewSet, generics.GenericAPIView):
    serializer_class = serializers.OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=False, url_path='chef-stats')
    def chef_stats(self, request):
        user = request.user
        if user.role not in ['ADMIN', 'CHEF']:
            return Response({"detail": "Bạn không có quyền xem thống kê này."}, status=403)

        period = request.query_params.get('period', 'day')
        specific_date = request.query_params.get('date')
        now = timezone.now()

        filter_kwargs = {}

        if period == 'date' and specific_date:
            try:
                target_date = parse_date(specific_date)
                if target_date:
                    filter_kwargs['created_date__date'] = target_date
            except ValueError:
                pass
        elif period == 'day':
            filter_kwargs['created_date__date'] = now.date()
        elif period == 'month':
            filter_kwargs['created_date__year'] = now.year
            filter_kwargs['created_date__month'] = now.month
        elif period == 'year':
            filter_kwargs['created_date__year'] = now.year

        dish_filter = {f"order__{k}": v for k, v in filter_kwargs.items()}

        dish_stats = OrderDetail.objects.filter(
            order__status='COMPLETED',
            **dish_filter
        ).values('dish__name').annotate(
            total_qty=Sum('quantity'),
            total_revenue=Sum(F('quantity') * F('unit_price'))
        ).order_by('-total_qty')

        completed_orders = Order.objects.filter(
            status='COMPLETED',
            **filter_kwargs
        )

        if period == 'month':
            time_stats = completed_orders.annotate(time=TruncMonth('created_date'))
        elif period == 'week':
            time_stats = completed_orders.annotate(time=TruncWeek('created_date'))
        else:
            time_stats = completed_orders.annotate(time=TruncDay('created_date'))

        time_stats = time_stats.values('time').annotate(
            order_count=Count('id'),
            revenue=Sum('total_amount')
        ).order_by('-time')

        return Response({
            "dish_stats": dish_stats,
            "time_stats": time_stats
        }, status=status.HTTP_200_OK)

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.prefetch_related('details__dish').select_related('table').order_by('-created_date')

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        period = self.request.query_params.get('period')
        specific_date = self.request.query_params.get('date')
        now = timezone.now()

        if period == 'date' and specific_date:
            try:
                target_date = parse_date(specific_date)
                if target_date:
                    queryset = queryset.filter(created_date__date=target_date)
            except ValueError:
                pass
        elif period == 'day':
            queryset = queryset.filter(created_date__date=now.date())
        elif period == 'month':
            queryset = queryset.filter(created_date__year=now.year, created_date__month=now.month)
        elif period == 'year':
            queryset = queryset.filter(created_date__year=now.year)

        if user.role == 'ADMIN':
            return queryset

        if user.role == 'CHEF':
            return queryset.filter(
                status__in=['PENDING', 'CONFIRMED', 'COOKING']
            )

        return queryset.filter(user=user)

    @action(methods=['post'], detail=True, url_path='take-order')
    def take_order(self, request, pk=None):
        order = self.get_object()
        if order.status in ['PENDING', 'CONFIRMED']:
            order.status = 'COOKING'
            order.save()
            return Response({"status": "COOKING", "detail": "Đang chế biến món ăn."}, status=status.HTTP_200_OK)
        return Response({"detail": "Trạng thái không hợp lệ."}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], detail=True, url_path='ready-order')
    def ready_order(self, request, pk=None):
        order = self.get_object()
        if order.status == 'COOKING':
            order.status = 'READY'
            order.save()
            return Response({"status": "READY", "detail": "Món ăn đã sẵn sàng phục vụ!"}, status=status.HTTP_200_OK)
        return Response({"detail": "Đơn hàng chưa được tiếp nhận nấu."}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(methods=['get', 'patch'], detail=True, url_path='update-order')
    def update_order_info(self, request, pk=None):
        order = self.get_object()

        if order.status == 'COMPLETED':
            return Response({"detail": "Đơn hàng đã hoàn tất, không thể chỉnh sửa."},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.method.__eq__('PATCH'):

            s = serializers.OrderSerializer(order, data=request.data, partial=True)
            if s.is_valid():
                s.save()
                return Response(s.data, status=status.HTTP_200_OK)
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializers.OrderSerializer(order).data)

    @action(methods=['post'], detail=True, url_path='pay')
    def pay_order(self, request, pk=None):
        order = self.get_object()

        if order.status == 'COMPLETED':
            return Response({"detail": "Đơn này đã thanh toán rồi."}, status=400)

        order.status = 'COMPLETED'
        order.payment_method = request.data.get('payment_method', 'CASH')
        order.save()

        return Response({"detail": "Thanh toán thành công, bàn đã trống!"}, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path='cancel')
    def cancel_order(self, request, pk=None):
        order = self.get_object()

        if order.status == 'PENDING':
            order.status = 'CANCELLED'
            order.save()
            return Response({"detail": "Hủy đơn thành công."})

        return Response({"detail": "Đơn hàng đã được xử lý, không thể hủy."}, status=400)

    @action(methods=['get'], detail=False, url_path='admin-stats')
    def admin_stats(self, request):
        if request.user.role != 'ADMIN':
            return Response({"detail": "Quyền này chỉ dành cho Admin"}, status=403)

        period = request.query_params.get('period', 'day')
        specific_date = request.query_params.get('date')
        now = timezone.now()

        revenue_query = Order.objects.filter(status='COMPLETED')
        count_query = Order.objects.all()

        if period == 'date' and specific_date:
            try:
                target_date = parse_date(specific_date)
                if target_date:
                    revenue_query = revenue_query.filter(created_date__date=target_date)
                    count_query = count_query.filter(created_date__date=target_date)
            except ValueError:
                pass

        elif period == 'day':
            revenue_query = revenue_query.filter(created_date__date=now.date())
            count_query = count_query.filter(created_date__date=now.date())

        elif period == 'month':
            revenue_query = revenue_query.filter(created_date__year=now.year, created_date__month=now.month)
            count_query = count_query.filter(created_date__year=now.year, created_date__month=now.month)

        elif period == 'year':
            revenue_query = revenue_query.filter(created_date__year=now.year)
            count_query = count_query.filter(created_date__year=now.year)

        overall_revenue = revenue_query.aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = count_query.count()
        total_dishes = Dish.objects.count()

        order_status_stats = count_query.values('status').annotate(count=Count('id'))

        return Response({
            "summary": {
                "overall_revenue": overall_revenue,
                "total_dishes": total_dishes,
                "total_orders": total_orders
            },
            "order_status_stats": order_status_stats
        })


class DishView(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Dish.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.DishDetailSerializer
    pagination_class = paginators.DishPaginator

    def get_permissions(self):
        if self.action in ['create', 'partial_update', 'destroy']:
            return [perms.IsChefOwner()]

        if self.action in ['like', 'get_reviews'] and self.request.method in ['POST', 'PATCH']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def create(self, request):
        serializer = serializers.DishSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(chef=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        query = self.queryset

        q = self.request.query_params.get('q')
        if q:
            query = query.filter(name__icontains=q)

        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price: query = query.filter(price__gte=min_price)
        if max_price: query = query.filter(price__lte=max_price)

        chef_id = self.request.query_params.get('chef_id')
        if chef_id:
            query = query.filter(chef_id=chef_id)

        order_by = self.request.query_params.get('ordering')
        if order_by:
            if order_by == 'rating':
                from django.db.models import Avg
                query = query.annotate(avg_rating=Avg('review__rating')).order_by('-avg_rating')
            else:
                query = query.order_by(order_by)

        max_time = self.request.query_params.get('max_time')
        if max_time:
            query = query.filter(preparation_time__lte=max_time)

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

    def partial_update(self, request, pk=None):
        dish = self.get_object()

        serializer = serializers.DishSerializer(dish, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response(
            {"detail": "Đã ẩn món ăn thành công"},
            status=status.HTTP_200_OK
        )

    @action(methods=['post'], detail=False, url_path='compare')
    def compare_dishes(self, request):
        ids = request.data.get('ids', [])
        dishes = Dish.objects.filter(id__in=ids, active=True)
        serializer = serializers.DishDetailSerializer(dishes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserView(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False,
            permission_classes=[permissions.IsAuthenticated])
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


class TagView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer

