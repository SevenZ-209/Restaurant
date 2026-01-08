# Restaurant APIs - AI Coding Guidelines

## Architecture Overview
This is a Django REST API project for restaurant management with MySQL database and Cloudinary for media storage.

**Core Models:**
- `User`: Custom user model with roles (ADMIN, CHEF, CUSTOMER). Uses CloudinaryField for avatars.
- `Dish`: Restaurant dishes with local ImageField uploads, linked to Category, Chef (User), and Tags.
- `Category`: Dish categories.
- `Tag`: Dish tags (many-to-many with Dish).
- `Review`: User reviews on dishes (unique per user-dish).
- `Like`: User likes on dishes (unique per user-dish).
- `Order`: User orders for dishes with payment methods.

**BaseModel**: Abstract model providing `active` boolean, `created_date`, `updated_date` fields. All concrete models inherit from this.

**API Structure:**
- DRF ViewSets for CRUD operations.
- Filtering: Dishes by name (q param), category_id.
- Pagination: Custom DishPaginator.
- Authentication: OAuth2 provider configured.

**Admin Interface:**
- Custom admin site using Jazzmin with Vietnamese labels.
- Stats view at `/admin/stats-view/` showing category dish counts.
- Image previews in admin lists/details.

## Key Conventions
- **Media Handling**: User avatars use CloudinaryField; dish images use Django's ImageField with local storage (`restaurant/%Y/%m`).
- **User Roles**: Chefs are created inactive by default (see CategorySerializer.create - note: this seems misplaced).
- **Soft Deletes**: Use `active` field instead of hard deletes.
- **Unique Constraints**: Reviews and Likes are unique per user-dish pair.
- **Rich Text**: Dish descriptions use CKEditor RichTextField.

## Development Workflows
- **Run Server**: `python manage.py runserver`
- **Database**: MySQL with PyMySQL. Run `python manage.py makemigrations` and `migrate` after model changes.
- **Create Superuser**: `python manage.py createsuperuser` (set role to ADMIN manually).
- **API Docs**: Swagger at `/swagger/`, ReDoc at `/redoc/`.
- **Admin**: `/admin/` with custom stats view.

## Common Patterns
- **Serializer Inheritance**: DishDetailSerializer extends DishSerializer to include tags.
- **ViewSet Filtering**: Override `get_queryset` for query params (e.g., DishView).
- **Admin Customizations**: Use `show_image` methods for image displays, `list_editable` for quick edits.
- **Router Registration**: Use DefaultRouter for API endpoints in `restaurant/urls.py`.

## Dependencies & Config
- **Cloudinary**: Configured in settings.py for media uploads.
- **OAuth2**: Client credentials in settings.py for authentication.
- **Jazmin**: Admin theme with custom icons and Vietnamese text.
- **CKEditor**: For rich text editing in admin.

Reference: `restaurant/models.py` for data relationships, `restaurant/admin.py` for admin patterns, `restaurantapis/settings.py` for config.</content>
<parameter name="filePath">d:\Restaurant\.github\copilot-instructions.md