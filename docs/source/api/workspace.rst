Workspace API
=============

Workspace is an object, which gather subworkspaces. Subworkspace is
object which store, which statenets are used currently in this subworkspace.
You can add or remove from subworkspace statements.


CRUD Methods for Statement model
================================

Create
------

POST: /workspace/create/
    create workspace object and returns it with id

POST: /workspace/create/subworkspace/
    create subworkspace object and returns it with id


Read
----

GET: /workspace/get/list/?last_id
    returns list of workspaces starting from last_id

GET: /workspace/get/<int:pk>/
    get information about workspace with id=pk

GET: /workspace/<int:pk>/subworkspaces
    return all subworkspaces of workspace with id=pk

GET: /workspace/get/subworkspace/<int:pk>/
    return subworksapce with id=pk


Update
------

PUT: /workspace/save/
    save given workspace

PUT: /workspace/save/subworkspace/
    save given subworkspace


Delete
------

DELETE: /workspace/delete/<int:pk>/
    delete workspace with id=pk

DELETE: /workspace/delete/subworkspace/<int:pk>
    delete subworkspace with id=pk