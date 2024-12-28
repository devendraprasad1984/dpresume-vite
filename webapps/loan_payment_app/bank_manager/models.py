from django.db import models


class BANKS(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True)
    uid = models.CharField(max_length=30, null=True, unique=True)
    name = models.CharField(max_length=100, null=True)
    when = models.DateTimeField(auto_now_add=True, blank=True)
