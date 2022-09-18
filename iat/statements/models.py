from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Statement(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=120)
    statement = models.TextField()
    veracity = models.SmallIntegerField(
        validators = [
            MaxValueValidator(100, "Veracity can not exceed 100"),
            MinValueValidator(0, "Veracity can not be negative")
        ]
    )
    rel_statements = models.ManyToManyField('self', default = [])

