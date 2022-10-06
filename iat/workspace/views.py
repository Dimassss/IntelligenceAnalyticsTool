from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from django.shortcuts import get_object_or_404
from .models import Workspace, Subworkspace
from .serializers import WorkspaceSerializer, SubworkspaceSerializer


# /create/
@api_view(["POST"])
@parser_classes([JSONParser])
def create_workspace(request):
    workspace_serializer = WorkspaceSerializer(data = request.data)

    if workspace_serializer.is_valid():
        workspace = workspace_serializer.save()
        workspace.save()

        return Response(WorkspaceSerializer(workspace).data)

    return Response({
        'errors': workspace_serializer.errors
    })

    
# /delete/<int:pk>/
@api_view(["DELETE"])
def delete_workspace(request, pk):
    workspace = get_object_or_404(Workspace, pk = pk)
    workspace.delete()

    return Response(WorkspaceSerializer(workspace).data)

    
# /save/
@api_view(["PUT"])
@parser_classes([JSONParser])
def save_workspace(request):
    if 'id' not in request.data:
        return Response({
            'errors': ["id is not set"]
        })

    workspace_old = get_object_or_404(Workspace, pk = int(request.data['id']))
    workspace_serializer = WorkspaceSerializer(workspace_old, data = request.data)
    
    if workspace_serializer.is_valid():
        workspace = workspace_serializer.save()
        workspace.save()

        return Response(WorkspaceSerializer(workspace).data)

    return Response({
        'errors': workspace_serializer.errors
    })

    
# /get/list/?last_id=pk
@api_view(["GET"])
def get_workspaces(request):
    if 'last_id' not in request.GET:
        workspace_arr = Workspace.objects.all().order_by('-id')[:10]
    else:
        pk = int(request.GET.get("last_id"))
        workspace_arr = Workspace.objects.all().filter(pk__lt = pk).order_by('-id')[:10]
    
    workspace_serializer_arr = [WorkspaceSerializer(w).data for w in workspace_arr]

    return Response(workspace_serializer_arr)

# /get/<int:pk>/ 
@api_view(["GET"])
def get_workspace(request, pk):
    w = get_object_or_404(Workspace, pk=pk)
    
    return Response(WorkspaceSerializer(w).data)

# /get/subworkspace/<int:pk>/
@api_view(["GET"])
def get_subworkspace(request, pk):
    sw = get_object_or_404(Subworkspace, pk=pk)

    return Response(SubworkspaceSerializer(sw).data)

# /create/subworkspace/ 
@api_view(["POST"])
@parser_classes([JSONParser])
def create_subworkspace(request):
    subworkspace_serializer = SubworkspaceSerializer(data = request.data)

    if subworkspace_serializer.is_valid():
        subworkspace = subworkspace_serializer.save()
        subworkspace.save()

        return Response(SubworkspaceSerializer(subworkspace).data)

    return Response({
        'errors': subworkspace_serializer.errors
    })

# /save/subworkspace/
@api_view(["PUT"])
@parser_classes([JSONParser])
def save_subworkspace(request):
    if 'id' not in request.data:
        return Response({
            'errors': ["id is not set"]
        })

    subworkspace_old = get_object_or_404(Subworkspace, pk = int(request.data['id']))
    subworkspace_serializer = SubworkspaceSerializer(subworkspace_old, data = request.data)
    
    if subworkspace_serializer.is_valid():
        subworkspace = subworkspace_serializer.save()
        subworkspace.save()

        return Response(SubworkspaceSerializer(subworkspace).data)

    return Response({
        'errors': subworkspace_serializer.errors
    })

# /delete/subworkspace/<int:pk> 
@api_view(["DELETE"])
def delete_subworkspace(request, pk):
    subworkspace = get_object_or_404(Subworkspace, pk = pk)
    subworkspace.delete()

    return Response(SubworkspaceSerializer(subworkspace).data)