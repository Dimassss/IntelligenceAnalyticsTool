import { IconButton, Flex } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { useSelector } from "react-redux"

import { getAllStatements } from '../../store/records/statementSlice'
import { FaLocationArrow, FaShareAlt } from 'react-icons/fa'
import GraphView, { EdgeComponentType, EdgeType, VertixComponentType, VertixType } from './GraphView'
import { useEffect, useRef, useState } from 'react'
import { StatementType } from '../../types/model/Statement'
import { getPreviewedRecord, getRecords, getSelectedRecord, getUsedRecords, RecordsType, setPreviewedRecord, setSelectedRecord } from '../../store/recordsSlice'
import { VertixComponentFactory } from '../../lib/components/graph/VertixComponentFabric'
import { EdgeComponentFabric } from '../../lib/components/graph/EdgeComponentFabric'
import { GraphEngine } from '../../lib/components/graph/GraphEngine'



export default function GraphEditor({onUpdateNode}) {
    const margins = {top: 20, left: 20, right: 20, bottom: 20}
    const [graphEngine, setGraphEngine] = useState(new GraphEngine({
            margins
        }, {
            statement: (st: StatementType) => {
                return st.use_statements.map(id => ({type: 'statement', id: id.toString()}))
            }
        })
    )

    const usedRecords = useSelector(getUsedRecords)
    const allRecords = useSelector(getRecords)
    const [records, setRecords] = useState({} as RecordsType)
    
    const divRef = useRef(null)
    const [mode, setMode] = useState('pointer')
    const [dimensions, setDimenstions] = useState({width: 1, height: 1})

    const [vertixes, setVertixes] = useState({} as {[nodeType: string]: {[nodeId: string]: VertixType}})
    const [edges, setEdges] = useState({} as {[nodeType: string]: EdgeType[]})
    //coordinates of edge pointer part. This is need when calculateing which edge is selected (ex. for deleting)
    const [edgePointers, setEdgePointers] = useState({} as {[nodeType: string]: {x: number, y: number, edge: EdgeType}[]}) 

    //in fact there will be only one vertix, but only axis will be changed each time. Axis are equal to mouse position on plot
    const [mouseVertix, setMouseVertix] = useState({x:0, y:0, r:0, node: {}} as VertixType)        
    const [mouseEdge, setMouseEdge] = useState(null as EdgeType)
    const [selectedEdge, setSelectedEdge] = useState(null as EdgeType)
    
    // is needed for imitation of onCLick event. onCLick event dont not work, because onMouseDown event update svg, so onClick can not be emited
    const [vertixMouseDown, setVertixMouseDown] = useState(null as {type: string, id: number, x: number, y: number, clickCount: number, stopTimeout?: any})
    // is needed for example to know which vertix is moving by mouse now.
    const [selectedVertix, setSelectedVertix] = useState(null as {type: string, id: number})



    // Creating components which are needed for GraphView component
    // Vertix Component
    let VertixComponent = VertixComponentFactory({
        mode, 
        selectedVertix, 
        setSelectedVertix, 
        vertixes, 
        setMouseVertix, 
        onUpdateNode, 
        vertixMouseDown, 
        setVertixMouseDown
    })
    
    useEffect(() => {
        VertixComponent = VertixComponentFactory({
            mode, 
            selectedVertix, 
            setSelectedVertix, 
            vertixes, 
            setMouseVertix, 
            onUpdateNode, 
            vertixMouseDown, 
            setVertixMouseDown
        })
    }, [mode, vertixes, selectedVertix, vertixMouseDown])

    // Edge Component
    let EdgeComponent = EdgeComponentFabric(selectedEdge)

    useEffect(() => {
        EdgeComponent = EdgeComponentFabric(selectedEdge)
    }, [selectedEdge])

    // update records if new are added or removed from list
    useEffect(() => {
        const newRecords = {}
        
        usedRecords.forEach(({type, id}) => {
            if(!(type in newRecords)) newRecords[type] = []
            
            newRecords[type].push(allRecords[type].find(el => el.id == id))
        })

        setRecords(newRecords)
    }, [usedRecords])

    //Create pointers for edges. THis is needed to calculate distance to mouse
    useEffect(() => {
        const newEdgePointers = {}

        for(let type in edges) {
            newEdgePointers[type] = []

            for(let i in edges[type]){
                const s = edges[type][i].source
                const t = edges[type][i].target

                if(s.type == 'statement' && t.type == 'statement') {
                    const source = vertixes[type][s.id]
                    const target = vertixes[type][t.id]

                    const vect = [target.x - source.x, target.y - source.y]
                    const edgeLength = Math.hypot(...vect)
                    const pointerPartMaxLength = 15 + target.r //px
                    const redPartLengthRatio = Math.min(1, pointerPartMaxLength / edgeLength)
                    const pointer = {
                        x1: target.x - redPartLengthRatio * vect[0] * 0.5,
                        y1: target.y - redPartLengthRatio * vect[1] * 0.5,
                        x2: target.x,
                        y2: target.y
                    } 

                    newEdgePointers[type].push({
                        x: (pointer.x1 + pointer.x2) / 2,
                        y: (pointer.y1 + pointer.y2) / 2,
                        edge: edges[type][i]
                    })
                }
            }
        }

        setEdgePointers(newEdgePointers)
    }, [edges])

    useEffect(() => {
        graphEngine.setRecords(records)
        graphEngine.redraw()

        setVertixes(graphEngine.getVertixes())
        setEdges(graphEngine.getEdges())
    }, [records])

    useEffect(() => {
        if(!divRef) return;

        const width = divRef.current.offsetWidth
        const height = Math.floor(width * (9/16))

        setDimenstions({width, height})
    }, [divRef])

    useEffect(() => {
        if(selectedVertix && mode == 'edge-editing') {
            setMouseEdge({
                target: {
                    type: 'mouse',
                    id: 0
                },
                source: selectedVertix
            })
        } else {
            setMouseEdge(null)
        }
    }, [selectedVertix])

    return (
        <Grid templateColumns='repeat(24, 1fr)'>
            <GridItem colSpan={1}>
                <Flex direction={'column'}>
                    <IconButton 
                        icon={<FaLocationArrow/>}
                        aria-label="Ponter"  
                        colorScheme={mode == 'pointer' ? "blue" : null}
                        rounded="0" 
                        roundedBottomRight='md'
                        onClick={() => {
                            setMode('pointer')
                        }}
                        w="100%"
                    />

                    <IconButton 
                        icon={<FaShareAlt/>}
                        aria-label="Pointer"  
                        colorScheme={mode == 'edge-editing' ? "blue" : null}
                        rounded="0" 
                        roundedBottomRight='md'
                        onClick={() => {
                            setMode('edge-editing')
                        }}
                        w="100%"
                    />
                </Flex>
            </GridItem>
            <GridItem colSpan={23} ref={divRef}>
                <GraphView
                    vertixes={{...vertixes, mouse: mouseVertix ? {'0': mouseVertix} : {}}} 
                    edges={{...edges, mouse: mouseEdge ? [mouseEdge] : []}}
                    width={dimensions.width} 
                    height={dimensions.height}
                    VertixComponent={VertixComponent}
                    EdgeComponent={EdgeComponent}

                    onPlotMouseLeave={(e) => {
                        setSelectedVertix(null)
                    }}

                    onClick={(e) => {
                        if(mode == "edge-editing" && selectedEdge) {
                            //if we are here this means that we want ot delete the edge.

                            const type = selectedEdge.target.type
                            const id = selectedEdge.target.id
                            const target = vertixes[type][id].node
                            let newNode = {...target}

                            if(type == 'statement'){
                                const use_statements = (target as StatementType).use_statements.filter(id => id != selectedEdge.source.id)
                                newNode = {...target, use_statements} as StatementType
                            }
                            
                            onUpdateNode(type, newNode)
                        }
                    }}

                    onPlotMouseMove={(e) => {
                        const x = e.nativeEvent.offsetX * (1920 / dimensions.width);
                        const y = e.nativeEvent.offsetY * (1080 / dimensions.height);

                        if(selectedVertix && mode == 'pointer') {
                            const node = records[selectedVertix.type].find(rec => rec.id == selectedVertix.id)
                            
                            graphEngine.updateVertix(
                                selectedVertix.type, 
                                node, 
                                x,
                                y
                            )

                            setVertixes(graphEngine.getVertixes())
                            setEdges(graphEngine.getEdges())
                        } else if(mode == 'edge-editing') {
                            setMouseVertix({
                                x,
                                y, 
                                r: 0, 
                                node: {id: 0}
                            })

                            //calculating if pointer is in vertix
                            let inVertix = false;
                            
                            for(let type in vertixes){
                                if(inVertix) break

                                for(let id in vertixes[type]) {
                                    const v = vertixes[type][id]
                                    
                                    if(v.r >= Math.hypot(v.x-x, v.y-y)) {
                                        inVertix = true
                                        break;
                                    }
                                }
                            }

                            //calculating the clothest edge
                            let minIndex = null
                            let minNodeType = null;
                            let minDistance = +Infinity;
                            
                            if(!inVertix)
                            for(let nodeType in edgePointers) {
                                for(let i in edgePointers[nodeType]) {
                                    const dist = Math.hypot(edgePointers[nodeType][i].x - x, edgePointers[nodeType][i].y -y)

                                    if(minDistance > dist){
                                        minDistance = dist
                                        minNodeType = nodeType
                                        minIndex = i
                                    }
                                }
                            }

                            if(minIndex !== null && minDistance < 35 && !inVertix) {
                                setSelectedEdge(edgePointers[minNodeType][minIndex].edge)
                            } else {
                                setSelectedEdge(null)
                            }
                        }
                    }}
                />
            </GridItem>
        </Grid>
    )
}

