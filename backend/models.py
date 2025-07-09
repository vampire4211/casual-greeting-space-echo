from django.db import models

class AdminImage(models.Model):
    image_type = models.CharField(max_length=20, choices=[('hero', 'Hero'), ('carousel', 'Carousel')])
    position = models.IntegerField()
    image_data = models.BinaryField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

class VendorImageUpload(models.Model):
    vendor = models.ForeignKey('Vendor', on_delete=models.CASCADE)
    category = models.CharField(max_length=255)
    image_data = models.BinaryField()
    uploaded_at = models.DateTimeField(auto_now_add=True)