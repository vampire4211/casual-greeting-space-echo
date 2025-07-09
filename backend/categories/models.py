from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    image_id = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name

class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Subcategories"
        unique_together = ['category', 'name']
    
    def __str__(self):
        return f"{self.category.name} - {self.name}"

class AdminHomepageImages(models.Model):
    SECTION_CHOICES = [
        ('hero', 'Hero'),
        ('trending_carousel', 'Trending Carousel'),
    ]
    
    section = models.CharField(max_length=20, choices=SECTION_CHOICES)
    slot_number = models.IntegerField()
    image_data = models.BinaryField()
    image_name = models.CharField(max_length=255)
    image_type = models.CharField(max_length=50)
    alt_text = models.TextField(blank=True)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    uploaded_by = models.CharField(max_length=100, blank=True)  # Will store user ID
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['section', 'slot_number']
        db_table = 'admin_homepage_images'
    
    def __str__(self):
        return f"{self.section} - Slot {self.slot_number}"