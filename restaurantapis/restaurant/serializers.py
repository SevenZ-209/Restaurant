from rest_framework.exceptions import ValidationError

from restaurant.models import Category, Dish, User, Tag, Review, Like
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
        fields =['id', 'name']

class DishSerializer(ItemSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'price','image' ,'category', 'created_date', 'active']

class DishDetailSerializer(DishSerializer):
    tags = TagSerializer(many=True)
    class Meta:
        model = Dish
        fields = DishSerializer.Meta.fields + ['description','ingredients' , 'tags']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'password', 'avatar', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': False}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url

        return data

    def update(self, instance, validated_data):
        keys = set(validated_data.keys())
        if keys - {'first_name', 'last_name'}:
            raise ValidationError({'error': 'Invalid fields'})

        return super().update(instance, validated_data)

    def create(self, validated_data):
        role = validated_data.get('role', User.Role.CUSTOMER)

        password = validated_data.pop('password', None)

        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)

        if role == User.Role.CHEF:
            instance.is_active = False
            instance.role = User.Role.CHEF
        else:
            instance.is_active = True
            instance.role = User.Role.CUSTOMER

        instance.save()
        return instance

class ReviewSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = UserSerializer(instance.user).data

        return data

    class Meta:
        model = Review
        fields = ['id', 'content', 'rating', 'created_date', 'user', 'dish']
        extra_kwargs = {
            'dish':{
                'write_only': True,
            }
        }

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'dish']
