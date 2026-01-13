from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, F
from django.utils.dateparse import parse_date

from restaurant import serializers, paginators, perms
from .models import Category, Dish, User, Review, Order, Like, OrderDetail, Tag

class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.AllowAny]


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

        # 1. Tìm theo tên
        q = self.request.query_params.get('q')
        if q:
            query = query.filter(name__icontains=q)

        # 2. Lọc theo danh mục
        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        # 3. Lọc theo giá
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price: query = query.filter(price__gte=min_price)
        if max_price: query = query.filter(price__lte=max_price)

        # --- BỔ SUNG THEO ĐỀ BÀI ---
        # 4. Lọc theo đầu bếp (Chef)
        chef_id = self.request.query_params.get('chef_id')
        if chef_id:
            query = query.filter(chef_id=chef_id)

        # 5. Sắp xếp (Thêm sắp xếp theo đánh giá - rating)
        # Giả sử bạn muốn sort theo rating trung bình (cần annotate trước đó hoặc sort đơn giản)
        order_by = self.request.query_params.get('ordering')
        if order_by:
            if order_by == 'rating':
                from django.db.models import Avg
                query = query.annotate(avg_rating=Avg('review__rating')).order_by('-avg_rating')
            else:
                query = query.order_by(order_by)

        max_time = self.request.query_params.get('max_time')  # Ví dụ: Tìm món làm dưới 30 phút
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

    def destroy(self, request, pk=None):
        dish = self.get_object()

        dish.active = False
        dish.save()
        return Response({"detail": "Đã xóa món ăn."}, status=status.HTTP_204_NO_CONTENT)

    @action(methods=['post'], detail=False, url_path='compare')
    def compare_dishes(self, request):
        # Body gửi lên: { "ids": [1, 5, 8] }
        ids = request.data.get('ids', [])
        dishes = Dish.objects.filter(id__in=ids, active=True)
        serializer = serializers.DishDetailSerializer(dishes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

class TagView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer

class OrderView(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    serializer_class = serializers.OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Order.objects.none()

        user = self.request.user

        if not user.is_authenticated:
            return Order.objects.none()

        if user.role == User.Role.CHEF:
            return Order.objects.filter(details__dish__chef=user).distinct().order_by('-created_date')

        if user.role == User.Role.ADMIN:
            return Order.objects.all().order_by('-created_date')

        return Order.objects.filter(user=user).order_by('-created_date')

    def partial_update(self, request, pk=None):
        """
        Hàm này sẽ hứng request PATCH /orders/{id}/
        Dùng để cập nhật một vài trường thông tin (không bắt buộc gửi hết).
        """
        try:
            # Lấy object dựa trên pk và check permission (IsOwner)
            order = self.get_object()

            # Kiểm tra logic nghiệp vụ (Ví dụ: Đã xong thì không cho sửa nữa)
            if order.status == 'COMPLETED':
                return Response({"detail": "Đơn hàng đã hoàn thành, không thể chỉnh sửa."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Khởi tạo serializer với partial=True (QUAN TRỌNG ĐỂ LÀM PATCH)
            serializer = serializers.OrderSerializer(order, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True, url_path='cancel')
    def cancel_order(self, request, pk=None):
        try:
            order = self.get_object()

            if order.status == 'PENDING':
                order.status = 'CANCELLED'
                order.save()
                return Response({"detail": "Hủy đơn hàng thành công."}, status=status.HTTP_200_OK)

            return Response(
                {"detail": "Đơn hàng đã được quán nhận, không thể hủy. Vui lòng liên hệ nhà hàng."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True, url_path='checkout')
    def checkout(self, request, pk):
        try:
            order = self.get_object()

            # 1. Kiểm tra: Chỉ đơn chưa hoàn thành mới được thanh toán
            if order.status == 'COMPLETED':
                return Response({"detail": "Đơn hàng này đã thanh toán rồi."}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Lấy phương thức thanh toán từ Client gửi lên
            confirm_method = request.data.get('payment_method')

            # Kiểm tra xem phương thức có hợp lệ không (Trừ UNKNOWN ra)
            valid_methods = ['CASH', 'PAYPAL', 'MOMO', 'ZALO']
            if confirm_method not in valid_methods:
                return Response(
                    {"detail": "Vui lòng chọn phương thức thanh toán hợp lệ (CASH, MOMO, ZALO...)"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 3. Cập nhật dữ liệu
            order.payment_method = confirm_method
            order.status = 'COMPLETED'
            order.save()

            return Response(serializers.OrderSerializer(order).data, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class StatsView(viewsets.ViewSet):
    @action(methods=['get'], detail=False, url_path='revenue')
    def get_revenue_stats(self, request):
        user = request.user
        if user.role not in [User.Role.CHEF, User.Role.ADMIN]:
            return Response({"detail": "Forbidden"}, status=403)

        queryset = OrderDetail.objects.filter(order__status='COMPLETED')

        # 1. Logic lọc theo User (Giữ nguyên)
        if user.role == User.Role.CHEF:
            queryset = queryset.filter(dish__chef=user)
        elif user.role == User.Role.ADMIN:
            chef_id = request.query_params.get('chef_id')
            if chef_id:
                queryset = queryset.filter(dish__chef_id=chef_id)

        # 2. --- BỔ SUNG: Logic lọc theo thời gian (Ngày/Tháng/Năm) ---
        # Param gửi lên: ?from_date=2024-01-01&to_date=2024-01-31
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        if from_date:
            queryset = queryset.filter(created_date__date__gte=parse_date(from_date))
        if to_date:
            queryset = queryset.filter(created_date__date__lte=parse_date(to_date))

        # 3. Thống kê (Giữ nguyên)
        stats = queryset.values('dish__id', 'dish__name').annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum(F('unit_price') * F('quantity'))
        ).order_by('-total_revenue')

        return Response(stats, status=200)