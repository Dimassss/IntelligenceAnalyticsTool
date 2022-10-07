Redux Storage
=============

workspaceSlice.ts
-----------------
It is needed to store workspaces objects and current workspace which now in use.
As well, there are all needed CRUD requests to backend which are related to workspace model.


/workspaces/subworkspaceSlice.ts
--------------------------------
Here is stored subworkspaces which were loaded from backend and current subworkspaces, which in use.
If you select subworkspace on page, you have to set it in this store, so all components will work
correctly.


recordsSlice.ts
---------------
Here is stored general information about records from database like statements or files. In fact all objects
which can be used to build schemes on graph plot.
Variables `selectedRecord` and `previewedRecord` are storing records, which are currently are selected or previewed.
If you want to select record (for example edition in the form) you have to set `selectedRecord`, so all components
will work correctly. You have to set `previewedRecord` when you want to preview or show information about the record somewhere.
`records` store all records which you have now. For exmaple statements which you get from database you must also save in this
variable, to make components functionate properly. `recordsOrder` is variable which is setted autiomaticly when you set `records`
variable and store information about proper order in which must be displayed records from `records` variable.
`usedRecords` is variable which store records, which are currently in use, for example in subworkspace. You have to set this 
variable, when you want to gather specific records to use at the current page from all list of records, to make all components functionate properly.


/records/statementSlice.ts
--------------------------
`statements` is storing all statements which were gotten from database.
`lastId` is variable which store id of last loaded statement. Is needed to load only new list of statements when calling
a method to load new list of statements next time.
`lastCreatedStatement` is variable which store lsat created statements, so we can now, for example, get id of last created statement.