Documentation of workspace app
=================================


Models
------

 * Workspace: 
    created_at, title, description

 * Subworkspace:
    created_at, title, workspace_id, used_statements


Serializers
-----------

 * WorkspaceSerializer:
    created_at, title, description, subworkspaces

 * SubworkspaceSerializer:
    created_at, title, used_statements, workspace_id


Workspace app interaction
-------------------------

In this app are two models: Workspace and Subworkspace.
Workspace is needed to gather Subworkspaces into one group.
Subworkspace is model which is needed to gather statements into one group,
which are used in current subworkspace. This model has `workspace_id` property
which store id of workspace to which this subworkspace belongs and 
`used_statements` which store ids of statements which are used in this 
subworkspace.
