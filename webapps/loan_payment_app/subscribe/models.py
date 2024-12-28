from django.db import models


# Create your models here.
class SUBSCRIPTION(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True)
    name = models.CharField(null=True, max_length=200)
    email = models.EmailField(null=False, unique=True)
    secret_key = models.TextField(null=True)
    signer = models.TextField(null=True)
    allow_external = models.BooleanField(default=False)
    allow_crud_internal = models.BooleanField(default=False)
    type = models.CharField(default='manager', null=True, max_length=50)
    when = models.DateTimeField(auto_now_add=True, blank=True)
