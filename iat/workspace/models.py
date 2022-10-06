from django.db import models
from statements.models import Statement


class Workspace(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=120)
    description = models.TextField()


class Subworkspace(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=120)
    description = models.TextField()
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='subworkspaces')
    used_statements = models.ManyToManyField(Statement, default = [])