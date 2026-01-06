from restaurant.models import Category, Dish, User, Tag
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

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        if user.role == 'CHEF':
            user.is_active = False
        user.save()
        return user

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields =['id', 'name']

class DishSerializer(ItemSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'price', 'category', 'created_date', 'active']

class DishDetailSerializer(DishSerializer):
    tags = TagSerializer(many=True)
    class Meta:
        model = Dish
        fields = DishSerializer.Meta.fields + ['description', 'tags']

# class UserSerializer(serializers.ModelSerializer):