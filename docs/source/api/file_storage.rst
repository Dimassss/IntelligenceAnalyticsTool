File Storage API
================

Philosophy of the API.
I can create file metadata records in app. When it is needed I can upload files to app or 
send request to donwload file from url, which is present in file meta data record.

To create file metadata record I must give uri of file or upload it in form.
If user directly upload the file, so uri will be null


Create
------ 

POST: /file_storage/upload
    The only task of this URL is to save new files to the storage
POST: /file_storage/upload/url/<int:pk>
    Request that download file on uri which is stored in file meta data object.

Read
----

GET: /file_storage/get/<int:pk>
    return blob file.
    For example, can be used in <img> tag to display image.
    In the case, when file can not be loaded, like zip file, it will throw error

GET: /file_storage/get/meta/<string:filetype>/<int:pk>
    `filetype` is needed to use corresponding view method.
    return meta data which is connected to the file.
    For example in case of .zip file it can be its usual meta data with its inner content described
    in separate json field in response.
GET: /file_storage/get/list?param1=&param2=&...&paramn=&count_here=0&count_to_get=20
    `param_j` is parameters for searching in database 
    `count_here` is count of files links which are already displayed on page (in fact, the amount
    of first elements which will be ignored in SELECT request to db)
    `count_to_get` is count of files which ahve to be returned from server.


Update
------

PUT: /file_storage/update/<int:pk>
    form as uploading but for update
    For example can remove old and upload new file.


Delete
------

DELETE: /file_storage/delete/<int:pk>
