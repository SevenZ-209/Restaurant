from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.utils.html import mark_safe
from restaurant.models import Category, Dish, User, Review, Order, Tag
from django.urls import path

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ['name']

class DishAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'show_image', 'price', 'category', 'chef', 'active', 'created_date')
    search_fields = ['name', 'description']
    list_filter = ['active', 'category', 'created_date']
    list_editable = ['active', 'price']
    readonly_fields = ['show_image_detail']

    def show_image(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" style="border-radius:5px;" />')
        return "No Image"

    show_image.short_description = "Ảnh"

    def show_image_detail(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="200" />')
        return "No Image"

    show_image_detail.short_description = "Ảnh hiện tại"

class MyAdminSite(admin.AdminSite):
    site_header = 'Restaurant Admin'

    def get_urls(self):
        return [path('stats-view/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        stats = Category.objects.annotate(count=Count('dish')).values('id', 'name', 'count')
        return TemplateResponse(request, 'admin/stats.html', {'stats': stats})


admin_site = MyAdminSite()

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'dish', 'total_amount', 'payment_method', 'created_date')
    list_filter = ('payment_method', 'created_date')
    search_fields = ('user__username', 'dish__name')
    readonly_fields = ('created_date',)

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'dish', 'rating', 'active', 'created_date')
    list_filter = ('rating', 'active')
    search_fields = ('content', 'user__username', 'dish__name')

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'first_name', 'last_name', 'email', 'role', 'show_avatar', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ('username', 'email')

    def show_avatar(self, obj):
        if obj.avatar:
            return mark_safe(f'<img src="{obj.avatar.url}" width="40" style="border-radius:50%;" />')
        return ""

    show_avatar.short_description = "Avatar"

admin_site.register(Category, CategoryAdmin)
admin_site.register(Dish, DishAdmin)
admin_site.register(Order, OrderAdmin)
admin_site.register(Review, ReviewAdmin)
admin_site.register(User, UserAdmin)
admin_site.register(Tag)