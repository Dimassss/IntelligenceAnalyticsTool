from django.conf import settings
from rest_framework import serializers
from ..models.FileMetaData import FileMetaData
from datetime import datetime
from ..utils.file import handle_file_upload, remove_file


class FileFormSerializer(serializers.Serializer):
    url = serializers.URLField(required=False, allow_null=True)
    filename = serializers.CharField(max_length=256, required=False)
    uploaded_file = serializers.FileField(allow_empty_file=True, required=False, allow_null=True)

    def validate(self, data):
        if not ("url" in data and data["url"] is not None) and not ("uploaded_file" in data and data["uploaded_file"] is not None):
            raise serializers.ValidationError("if no file is uploaded url must be specified")

        return data

    def create(self, validated_data):
        dt = datetime.now()

        file = validated_data["uploaded_file"] if "uploaded_file" in validated_data else None
        filename = validated_data["filename"] if "filename" in validated_data else (file.name if file is not None else datetime.timestamp(dt))
        mimetype = file.content_type if file is not None else None
        path = "{}/{}/{}/{}/".format(dt.year, dt.month, dt.day, dt.hour)

        filemeta = FileMetaData(
            url = validated_data["url"] if "url" in validated_data else None,
            filename = filename,
            mimetype = mimetype,
            path = ( path + str(datetime.timestamp(dt)) + '.' + filename ) if file is not None else None
        )

        if file is not None:
            handle_file_upload(file, path, str(datetime.timestamp(dt))+'.'+filename)

        return filemeta

    def update(self, instance, validated_data):
        dt = datetime.now()

        file = validated_data["uploaded_file"] if "uploaded_file" in validated_data else None
        mimetype = file.content_type if file is not None else None
        path = "{}/{}/{}/{}/".format(dt.year, dt.month, dt.day, dt.hour)

        instance.url = validated_data.get('url', instance.url)
        instance.filename = validated_data.get('filename', instance.filename)

        if file is not None:
            instance.path = (path + instance.filename) if instance.path is None else instance.path
            instance.mimetype = mimetype

            remove_file(instance.path)

            p = '/'.join(instance.path.split('/')[:-1]) + '/'
            f = instance.path.split('/')[-1]

            handle_file_upload(file, p, f)

        return instance

        

class FileMetaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileMetaData
        fields = ['id', 'created', 'updated', 'url', 'filename', 'mimetype']