from rest_framework import serializers
from .models import Workspace, Subworkspace
from statements.models import Statement
from datetime import datetime


class WorkspaceSerializer(serializers.Serializer):
    class Meta:
        model = Workspace
        fields = ('id', 'created_at', 'title', 'description', 'subworkspaces')

    id = serializers.IntegerField(required=False)
    created_at = serializers.DateTimeField(read_only=True)
    title = serializers.CharField(max_length=120)
    description = serializers.CharField()
    subworkspaces = serializers.SlugRelatedField(many=True, slug_field='id', queryset=Subworkspace.objects.all(), default=[])

    def create(self, validated_data):
        title = validated_data["title"]
        description = validated_data["description"]
        subworkspaces = validated_data["subworkspaces"]

        w = Workspace(title=title, description=description)

        if 'id' in validated_data:
            w.id = validated_data['id']

        w.save()
        w.subworkspaces.set(subworkspaces)
        
        return w

    def update(self, instance, validated_data):
        title = validated_data["title"]
        description = validated_data["description"]
        subworkspaces = validated_data["subworkspaces"]

        instance.title = title
        instance.description = description
        instance.subworkspaces.set(subworkspaces)

        return instance


class SubworkspaceSerializer(serializers.Serializer):
    class Meta:
        model = Subworkspace
        fields = ('id', 'created_at', 'title', 'description', 'used_statements', 'workspace_id')

    id = serializers.IntegerField(required=False)
    created_at = serializers.DateTimeField(read_only=True)
    title = serializers.CharField(max_length=120)
    description = serializers.CharField()
    used_statements = serializers.SlugRelatedField(many=True, slug_field='id', queryset=Statement.objects.all(), default=[])
    workspace_id = serializers.SlugRelatedField(many=False, slug_field='id', queryset=Workspace.objects.all())

    def create(self, validated_data):
        title = validated_data["title"]
        description = validated_data["description"]
        used_statements = validated_data["used_statements"]
        workspace_id = validated_data["workspace_id"]

        w = Subworkspace(title=title, description=description, workspace_id=workspace_id)

        if 'id' in validated_data:
            w.id = validated_data['id']

        w.save()
        w.used_statements.set(used_statements)
        
        return w

    def update(self, instance, validated_data):
        title = validated_data["title"]
        description = validated_data["description"]
        used_statements = validated_data["used_statements"]

        instance.title = title
        instance.description = description
        instance.used_statements.set(used_statements)

        return instance