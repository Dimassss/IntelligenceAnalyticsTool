from django.urls import path, include
from rest_framework import routers

from . import views

app_name = 'statements'
urlpatterns = [
    path('create/', views.create_statement),
    path('get/list/', views.get_new_statements),
    path('get/<int:pk>/', views.get_statement),
    path('save/', views.update_statement),
    path('delete/<int:pk>/', views.delete_statement)
]