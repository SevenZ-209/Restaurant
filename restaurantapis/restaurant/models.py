from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Quản trị viên"
        CHEF = "CHEF", "Đầu bếp"
        CUSTOMER = "CUSTOMER", "Khách hàng"

    avatar = CloudinaryField(null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CUSTOMER)
    phone = models.CharField(max_length=15, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True


class Dish(BaseModel):
    name = models.CharField(max_length=255)
    description = RichTextField(null=False)
    price = models.IntegerField(help_text="Giá (VNĐ)")
    ingredients = models.TextField()
    image = CloudinaryField(null=True, blank=True)
    preparation_time = models.IntegerField(null=True, blank=True)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    chef = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'CHEF'})
    tags = models.ManyToManyField('Tag')

    def __str__(self):
        return self.name

class Table(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    capacity = models.IntegerField(default=4)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.capacity} chỗ)"

class Tag(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)

    class Meta:
        abstract = True

class Review(Interaction):
    content = models.TextField(blank=False, null=False)
    rating = models.IntegerField(
        default=5,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    class Meta:
        unique_together = ('user', 'dish')

    def __str__(self):
        return f"{self.user.username} - {self.dish.name} ({self.rating} sao)"

class Like(Interaction):
    class Meta:
        unique_together = ('user', 'dish')

    def __str__(self):
        return f"{self.user.username} liked {self.dish.name}"

class Order(BaseModel):
    PAYMENT_METHODS = [
        ('UNKNOWN', 'Chưa xác định'),
        ('CASH', 'Tiền mặt'),
        ('PAYPAL', 'PayPal'),
        ('MOMO', 'MoMo'),
        ('ZALO', 'ZaloPay'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Chờ xác nhận'),
        ('CONFIRMED', 'Đã đặt bàn'),
        ('SEATED', 'Khách đang ăn'),
        ('COMPLETED', 'Đã thanh toán'),
        ('CANCELLED', 'Đã hủy'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True)
    checkin_time = models.DateTimeField(null=False)
    num_guests = models.IntegerField(default=1)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='UNKNOWN')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total_amount = models.BigIntegerField(default=0)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderDetail(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='details')
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.IntegerField()

    def __str__(self):
        return f"{self.order.id} - {self.dish.name}"