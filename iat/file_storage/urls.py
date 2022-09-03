from django.urls import path, include
from rest_framework import routers

from . import views

app_name = 'file_storage'
urlpatterns = [
    path('upload/', views.upload_file),
    path('get/list/', views.get_list),
    path('get/<int:filemeta_id>/', views.get_blob),
    path('get/meta/<str:filetype>/<int:filemeta_id>/', views.get_meta),
    path('upload/url/<int:filemeta_id>/', views.upload_from_url),
    path('update/<int:filemeta_id>', views.update_file),
    path('delete/<int:filemeta_id>/', views.delete_file)
]