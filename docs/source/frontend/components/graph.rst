Graph components
================

GraphEditor.tsx
---------------
THis is parent component to GraphView.tsx. This component accepts only one
variable as prop - `onUpdateNode`. This is function which is called, when
you change node. For example, when you add/remove edge to the vertix, 
node, which is related to the vertix, is passed to this callback funciton 
with changed `use_statements` property.
To display nodes on the grapg you must set `records` and `usedRecords` 
variables in the reocrdsSlice.ts store.


GraphView.tsx
-------------
In fact, this is svg component task of which to display vertixes and edges
on display. Look at GraphEditor.tsx code to understand how to use it.
Generaly you have to pass vertixes and edges to the component and 
the in order to display them you have to pass Vertix and Edge components
which will be passed with corresponding information to them. Also
there is some calback function which are realted to events such as
mouse move on the plot, mouse leave and on click events. Of course,
you have to pass width and height of the plot to the component.