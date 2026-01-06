from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Quản trị viên"
        CHEF = "CHEF", "Đầu bếp"
        CUSTOMER = "CUSTOMER", "Khách hàng"

    avatar = CloudinaryField(null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CUSTOMER)

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
    price = models.DecimalField(max_digits=10, decimal_places=0)
    ingredients = models.TextField()
    image = models.ImageField(upload_to='restaurant/%Y/%m', null=True)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    chef = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'CHEF'})
    tags = models.ManyToManyField('Tag')

    def __str__(self):
        return self.name


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
    rating = models.IntegerField(default=5)

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
        ('CASH', 'Tiền mặt'),
        ('PAYPAL', 'PayPal'),
        ('MOMO', 'MoMo'),
        ('ZALO', 'ZaloPay'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='CASH')
    total_amount = models.DecimalField(max_digits=12, decimal_places=0)