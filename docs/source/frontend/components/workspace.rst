Workspace components
====================

Here is stored all components which are related to Workspace and Subworkspace models.


WorkspaceForm.tsx
-----------------
THIs is form of WOrkspace model



WorkspaceTileContainer.tsx
--------------------------
This is components which is container to make look all that is in this container
look like tile. For exmaple, this compoent is used on home page.


WorkspaceFormTile.tsx
---------------------
THis is WorkspaceForm but which is display in WorkspaceTileContainer container.


WorkspaceTile.tsx
-----------------
Component which displays information about workspace in the WorkspaceTileContainer component


subworkspace/SubworkspaceTabs.tsx
---------------------------------
THis component whcih uses chakra-ui tabs to display subworkspaces as tabs and in
panels display information which records are used by this subworkspace in SubworkspacePanel component.
In order to set subworkspaces in this component you must set `subworkspaces` variable in
subworkspaceSlice.ts store


subworkspace/SubworkspacePanel.tsx
----------------------------------
Here is displayed list of records. Records which are used are checked.
For the previewed and selected records are applied styles.
In order to display records in this panel you must set `records` variable in recordsSlice.ts
store. THen you must set `usedRecords` in the same store to select records for this subworkspace.
To select or preview record you have to set corresponding variables inthe recordsSlice.ts store.

