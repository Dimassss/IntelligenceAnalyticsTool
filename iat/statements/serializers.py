from rest_framework import serializers
from .models import Statement
from datetime import datetime


class StatementSerializer(serializers.Serializer):
    class Meta:
        model = Statement

    id = serializers.IntegerField(required=False)
    created_at = serializers.DateTimeField(read_only=True)
    name = serializers.CharField(max_length=120)
    statement = serializers.CharField()
    veracity = serializers.IntegerField(max_value=100, min_value=0)
    use_statements = serializers.SlugRelatedField(many=True, slug_field='id', queryset=Statement.objects.all())

    def create(self, validated_data):
        name = validated_data["name"]
        statement = validated_data["statement"]
        veracity = validated_data["veracity"]
        use_statements = validated_data["use_statements"]

        s = Statement(name = name, statement = statement, veracity = veracity)
        
        if 'id' in validated_data:
            s.id = validated_data['id']

        s.save()
        s.use_statements.set(use_statements)
        
        return s

    def update(self, instance, validated_data):
        name = validated_data["name"]
        statement = validated_data["statement"]
        veracity = validated_data["veracity"]
        use_statements = validated_data["use_statements"]

        instance.name = name
        instance.statement = statement
        instance.veracity = veracity
        instance.use_statements.set(use_statements)

        return instance