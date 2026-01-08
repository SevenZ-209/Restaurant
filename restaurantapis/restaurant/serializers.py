from restaurant.models import Category, Dish, User, Tag, Review, Order
from rest_framework import serializers

class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            data['image'] = instance.image.url
        return data


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class DishSerializer(ItemSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    chef_name = serializers.CharField(source='chef.username', read_only=True)
    class Meta:
        model = Dish
        fields = ['id', 'name', 'price', 'prepare_time', 'category', 'category_name', 'chef', 'chef_name', 'created_date', 'active']


class DishDetailSerializer(DishSerializer):
    tags = TagSerializer(many=True, read_only=True)
    class Meta:
        model = Dish
        fields = DishSerializer.Meta.fields + ['description', 'ingredients', 'tags', 'image']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'dish', 'content', 'rating', 'created_date']
        read_only_fields = ['user', 'dish', 'created_date']


class OrderSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(source='dish.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'user_name', 'dish', 'dish_name', 'payment_method', 'total_amount', 'created_date', 'active']
        read_only_fields = ['created_date']


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'avatar_url']

    def get_avatar_url(self, obj):
        try:
            return obj.avatar.url if obj.avatar else None
        except Exception:
            return None


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'role']
        extra_kwargs = {'password': {'write_only': True}}