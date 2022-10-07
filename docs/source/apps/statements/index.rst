Documentation of statements app
===============================


Models
------

 * Statement: 
    created_at, name, statement, veracity, use_statements


Serializers
-----------

 * StatementSerializer:
    created_at, name, statement, veracity, use_statements


Statement App interaction
-------------------------

In fact all this project is about creating statements (or using other words - comments) and making
links between them. Each statement express opinion which is based on/substantiated with data which 
I attach to this statement. This data can be images, files, texts as well as other statements. 
Each model, which can be attached to the statement might have ManyToMany foreign key on statement model.
Of course ManyToMany, because each model can be attach to many statements, and each statement can attach a lot
of instances of the model.

Interaction is simple - CRUD methods. 