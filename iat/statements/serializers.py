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

    def create(self, validated_data):
        pk = validated_data['id']
        name = validated_data["name"]
        statement = validated_data["statement"]
        veracity = validated_data["veracity"]

        s = Statement(name = name, statement = statement, veracity = veracity, id = pk)
        
        return s

    def update(self, instance, validated_data):
        name = validated_data["name"]
        statement = validated_data["statement"]
        veracity = validated_data["veracity"]

        instance.name = name
        instance.statement = statement
        instance.veracity = veracity

        return instance