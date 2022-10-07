from django.urls import path, include
from rest_framework import routers

from . import views

app_name = 'workspace'
urlpatterns = [
    path('create/', views.create_workspace),
    path('delete/<int:pk>/', views.delete_workspace),
    path('save/', views.save_workspace),
    path('get/list/', views.get_workspaces),
    path('get/<int:pk>/', views.get_workspace),                                 # get workspace with id=pk
    path('get/<int:pk>/subworkspaces', views.get_workspace_subworkspaces),      # get all subworkspaces of workspace with id=pk
    path('create/subworkspace/', views.create_subworkspace),                    # create subworkspace
    path('save/subworkspace/', views.save_subworkspace),                        # save subworkspace
    path('delete/subworkspace/<int:pk>', views.delete_subworkspace),            # delete subworkspace with id=pk
    path('get/subworkspace/<int:pk>/', views.get_subworkspace),                 # get subworkspaces with id=pk
]