Statements API
==============

Statement is my own thoughts, which I argumentate. Statement can be in relation with any other data
in the database. Even with another statement or file. Each database for such links have to be created 
in the each app. So for example file_storage app have implement its own database of relation between
files and statements which describe given file or set of files.
Each statement has level of veracity. This level is estimated by intuition by the scale from 0 to 100.
0 means unrealiable and 100 means truth.


CRUD Methods for Statement model
================================

Create
------

POST: /statements/create/
    gets an object of statement in request and save it to database. Return ID of object


Read
----

GET: /statements/get/<int:pk>
    return instance of ibject in json by its id

GET: /statements/get/list/?q=pk1,pk2,...,pkn


Update
------

PUT: /statements/save/
    gets an updated object and save it to database


Delete
------

DELETE: /statements/delete/<int:pk>
    delete an object from database by given id