from django.http import Http404, FileResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from rest_framework.exceptions import NotFound, ParseError
from .serializers.file_serializers import FileMetaDataSerializer, FileFormSerializer
from .models.FileMetaData import FileMetaData
from .utils.file import handle_file_upload, download_from_url, remove_file

#Create

@api_view(["POST"])
@parser_classes([MultiPartParser])
def upload_file(request):
    #/file_storage/upload
    """
        data type: {
            file: File,
            url: URL,
            filename: String
        }
    """
    
    file_form_serializer = FileFormSerializer(data = request.data)
    if file_form_serializer.is_valid():
        filemeta = file_form_serializer.save()
        filemeta.save()
        return Response(FileMetaDataSerializer(filemeta).data)

    return Response({
        'errors': file_form_serializer.errors
    })

@api_view(["POST"])
def upload_from_url(request, filemeta_id):
    #/file_storage/upload/url/<int:filemeta_id>
    #on every request file from url will be downloaded again. Old file will be removed.

    filemeta = get_object_or_404(FileMetaData, pk = filemeta_id)
    
    if filemeta.url is not None:
        d = download_from_url(filemeta.url)
        
        if filemeta.path is not None:
            remove_file(filemeta.path)

        filemeta.path = d["path"]
        filemeta.mimetype = d["mimetype"]
    
        if filemeta.filename is None:
            filemeta.filename = d["filename"]

        filemeta.save()
        return Response(FileMetaDataSerializer(filemeta).data)

    
    return ParseError()


#Read

@api_view(["GET"])
def get_blob(request, filemeta_id):
    #/file_storage/get/<int:filemeta_id>/

    filemeta = get_object_or_404(FileMetaData, pk = filemeta_id)
    if filemeta.path is not None:
        res = FileResponse(open(settings.FILE_STORAGE_DIR / filemeta.path, 'rb'))
        res['Content-Type'] = filemeta.mimetype

        return res
    elif filemeta.url is not None:
        return HttpResponseRedirect(redirect_to=filemeta.url)
    
    return NotFound(detail="File with id {} don't exists".format(filemeta_id), code=404)


@api_view(["GET"])
def get_meta(request, filetype, filemeta_id):
    #/file_storage/get/meta/<str:filetype>/<int:filemeta_id>

    filemeta = get_object_or_404(FileMetaData, pk = filemeta_id)

    return Response( FileMetaDataSerializer(filemeta).data )
    
@api_view(["GET"])
def get_list(request):
    #/file_storage/get/list?param1=&param2=&...&paramn=&count_here=0&count_to_get=20
    files = FileMetaData.objects.all()
    
    return Response([FileMetaDataSerializer(f).data for f in files])

#Update

@api_view(["PUT"])
@parser_classes([MultiPartParser])
def update_file(request, filemeta_id):
    #/file_storage/update/<int:filemeta_id>

    filemeta = get_object_or_404(FileMetaData, pk = filemeta_id)

    file_form_serializer = FileFormSerializer(filemeta, data = request.data)
    if file_form_serializer.is_valid():
        filemeta = file_form_serializer.save()
        filemeta.save()
        return Response(FileMetaDataSerializer(filemeta).data)

    return Response({
        'errors': file_form_serializer.errors
    })


#Delete

@api_view(["DELETE"])
def delete_file(request, filemeta_id):
    #/file_storage/delete/<int:filemeta_id>
    filemeta = get_object_or_404(FileMetaData, pk = filemeta_id)
    filemeta.delete()

    return Response(FileMetaDataSerializer(filemeta).data)

