from rest_framework import serializers
from django.contrib.auth import models
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.Serializer):
    class Meta:
        mode = models.User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'last_login', 'date_joined']

    username = serializers.CharField(max_length=150)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.CharField(max_length=250, required=False)
    password = serializers.CharField()
    last_login = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        username = validated_data["username"]
        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        email = validated_data["email"] if 'email' in validated_data else ''
        password = make_password(validated_data["password"])

        u = models.User(
            username = username,
            first_name = first_name,
            last_name = last_name,
            email = email,
            password = password
        )
        
        return u

    def update(self, instance, validated_data):
        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        email = validated_data["email"] if 'email' in validated_data else ''
        password = make_password(validated_data["password"])

        instance.first_name = first_name
        instance.last_name = last_name
        instance.email = email
        instance.password = password

        return instance