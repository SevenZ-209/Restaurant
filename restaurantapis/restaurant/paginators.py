from rest_framework import pagination


class DishPaginator(pagination.PageNumberPagination):
    page_size = 6