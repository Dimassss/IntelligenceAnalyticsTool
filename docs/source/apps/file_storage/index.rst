.. |br| raw:: html
   
   <br/>


Documentation of file_storage app
=================================


Models
------

 * FileMetaData: 
    created, updated, url, filename, mimetype, path


Serializers
-----------

 * FileMetaDataSerializer:
    id, created, updated, url, filename, mimetype
 * FileFormSerializer:
    url, filename, uploaded_file |br|
    Methods:
     * create:
        If ``uploaded_file`` is not null, so file will be
        uploaded to the storage. 
        Also there will be created FileMetaData object and returned

     * update:
        If ``uploaded_file`` is not null, so old file will be
        removed and new file uploaded to storage in place of old.
        Also, there will be created a FileMetaData object on base
        of previous object model and form data.


File storage interaction
------------------------

All methods are placed in :file:`utils/file.py`.
To use that methods there must be set ``settings.FILE_STORAGE_DIR`` variable.

``path`` varialbe in all functions is relative to the ``settings.FILE_STORAGE_DIR`` path

There are the following function:
     * handle_file_upload(file, path. filename):
     * download_from_url(url):
        return object ``{'path', 'filename', 'mimetype'}``
     * remove_file(path):