from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from .serializers import UserSerializer
from django.contrib.auth import models


@api_view(["POST"])
@parser_classes([JSONParser])
def create_user(request):
    us = UserSerializer(data = request.data)

    if us.is_valid():
        u = us.save()
        u.save()

        return Response(us.data)

    return Response({
        'errors': us.errors
    })


@api_view(["PUT"])
@parser_classes([JSONParser])
def update_user(request, username):
    us_old = get_object_or_404(models.User, username = username)
    us = UserSerializer(us_old, data = request.data)

    if us.is_valid():
        u = us.save()
        u.save()

        return Response(us.data)

    return Response({
        'errors': us.errors
    })
