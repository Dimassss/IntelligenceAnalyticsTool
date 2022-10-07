lib
===
THis folder stores all helper code for components or pages


formating.ts
------------
Stores all function which are related to string formating


clone.ts
--------
Stores all function which are related to cloning object


components/graph/EdgeComponentFabric.tsx
----------------------------------------
Here is stored fabric function which return component of edge, which is used in GraphView component to create svg with gprap chart.


components/graph/VertixComponentFabric.tsx
------------------------------------------
The same as EdgeComponentFabric but returns Vertix component for GraphView component


components/graph/GraphEngine.ts
-------------------------------
Here is exported function GraphEngine which task is to simmulate display 1920x1080 to draw there
vertixes and edges. To use this function you must call this function which returns object whose prototype is this func.
This object has properties to get drawed vertixes and edges, which were previously generated from nodes which were given
to the constructor function. Also you can update information about vertix. FOr exmaple when moving vertix on the screen
you have to update information about vertix coordinate. WHen pass information to the mothods of this object you have to remember
that all is going on plot 1920x1080 pixels, so you have to rescale coordinates, which you pass to the methods.



