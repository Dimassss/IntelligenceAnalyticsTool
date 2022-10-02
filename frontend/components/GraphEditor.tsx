import { IconButton, Flex } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { useSelector } from "react-redux"

import { getAllStatements } from '../store/statementSlice'
import { FaLocationArrow, FaShareAlt } from 'react-icons/fa'
import GraphView, { EdgeComponentType, EdgeType, VertixComponentType, VertixType } from './GraphView'
import { useEffect, useRef, useState } from 'react'
import { StatementType } from '../types/model/Statement'



export default function GraphEditor({onSelectNode, onPreviewNode, selectedNode, previewedNode, onUpdateNode}) {
    const margins = {top: 20, left: 20, right: 20, bottom: 20}
    
    const divRef = useRef(null)
    const statements = useSelector(getAllStatements)
    const [mode, setMode] = useState('pointer')
    const [dimensions, setDimenstions] = useState({width: 1, height: 1})

    const [statementVertixes, setStatementVertixes] = useState({} as {[nodeId: string]: VertixType})
    const [statementEdges, setStatementEdges] = useState([] as EdgeType[])

    const [selectedVertix, setSelectedVertix] = useState(null as {type: string, id: number})
    //is needed for imitation of onCLick event. onCLick event dont not work, because onMouseDown event update svg, so onClick can not be emited
    const [vertixMouseDown, setVertixMouseDown] = useState(null as {type: string, id: number, x: number, y: number, clickCount: number, stopTimeout?: any})

    //in fact there will be only one vertix, but only axis will be changed each time. Axis are equal to mouse position on plot
    const [pointerVertixes, setPointerVertixes] = useState({'0': {x:0, y:0, r:0, node: {}}} as {[nodeId: string]: VertixType})        
    const [pointerEdges, setPointerEdges] = useState([] as EdgeType[])
    const [selectedEdge, setSelectedEdge] = useState(null as EdgeType)
    //coordinates of edge pointer part. THis is need when calculateing which edge is selected (ex. for deleting)
    const [edgePointers, setEdgePointers] = useState({} as {[nodeType: string]: {x: number, y: number, edge: EdgeType}[]}) 


    function VertixComponent({x, y, r, type, node}: VertixComponentType){
        if(type == 'pointer' || r <= 0) return <></>

        return (<g 
            onMouseDown={e => {
                if(mode == 'pointer') {
                    let v: any = vertixMouseDown ? {...vertixMouseDown} : {type, id: node.id, x, y}
                    v.clickCount = vertixMouseDown ? vertixMouseDown.clickCount : 0;
                    v.clickCount += 1

                    setVertixMouseDown(v)
                    setSelectedVertix({type, id: node.id})
                }
            }}
            onMouseUp={e => {
                if(mode == 'pointer') {
                    setSelectedVertix(null)

                    if(vertixMouseDown && 
                        vertixMouseDown.id == node.id && 
                        vertixMouseDown.type == type &&
                        Math.hypot(vertixMouseDown.x - x, vertixMouseDown.y - y) < 3
                    ){
                        if(vertixMouseDown.clickCount <= 1) {
                            const stopTimeout = setTimeout(() => {
                                onPreviewNode(statementVertixes[vertixMouseDown.id].node)
                                setVertixMouseDown(null)
                            }, 150)

                            const st = {...vertixMouseDown, stopTimeout}
                            setVertixMouseDown(st)
                        } else {
                            clearTimeout(vertixMouseDown.stopTimeout)

                            onSelectNode(statementVertixes[vertixMouseDown.id].node)
                            setVertixMouseDown(null)
                        }
                    } else {
                        if(vertixMouseDown && vertixMouseDown.stopTimeout !== undefined) {
                            clearTimeout(vertixMouseDown.stopTimeout)
                        }

                        setVertixMouseDown(null)
                    }
                }
            }}
            onClick={e => {
                if(mode == 'pointer'){
                    
                } else if(mode == 'edge-editing'){
                    if(!selectedVertix) {
                        setPointerVertixes({'0': {x, y, r:0, node: {}}})
                    } else {
                        const target = node as StatementType

                        let use_statements = [...target.use_statements]
                        if(!use_statements.includes(selectedVertix.id) && selectedVertix.id != target.id) {
                            use_statements.push(selectedVertix.id)
                        }

                        onUpdateNode({...target, use_statements})
                    }
                    
                    setSelectedVertix(!selectedVertix ? {type, id: node.id} : null)
                }
            }}
        >
            <circle cx={x} cy={y} r={r}/>
            <circle 
                cx={x} 
                cy={y} 
                r={r-2} 
                stroke={'red'} 
                fill={"none"} 
                strokeWidth={2} 
                strokeDasharray={2 * Math.PI * r}
                strokeDashoffset={2 * Math.PI * r * (3 -  (node as StatementType).veracity / 100)}
            />
        </g>)
    }

    function EdgeComponent({source, target}: EdgeComponentType){
        const vect = [target.x - source.x, target.y - source.y]
        const edgeLength = Math.hypot(...vect)
        const pointerPartMaxLength = 15 + 15 //px
        const redPartLengthRatio = Math.min(1, pointerPartMaxLength / edgeLength)
        const pointer = {
            x: target.x - redPartLengthRatio * vect[0],
            y: target.y - redPartLengthRatio * vect[1],
            stroke: '#f00'
        } 

        if(selectedEdge &&
            selectedEdge.source.id == source.node.id && selectedEdge.source.type == source.node.type &&
            selectedEdge.target.id == target.node.id && selectedEdge.target.type == target.node.type
        ) {
            pointer.stroke = '#a00'
        }

        return <g>
            <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} strokeWidth={1} stroke={'#000'}/>
            <line x1={pointer.x} y1={pointer.y} x2={target.x} y2={target.y} strokeWidth={2} stroke={pointer.stroke}/>
        </g>
    }

    useEffect(() => {
        const newEdgePointers = {statement: [] }

        for(let i in statementEdges){
            const s = statementEdges[i].source
            const t = statementEdges[i].target

            if(s.type == 'statement' && t.type == 'statement') {
                const source = statementVertixes[s.id]
                const target = statementVertixes[t.id]

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

                newEdgePointers.statement.push({
                    x: (pointer.x1 + pointer.x2) / 2,
                    y: (pointer.y1 + pointer.y2) / 2,
                    edge: statementEdges[i]
                })
            }
        }

        setEdgePointers(newEdgePointers)
    }, [statementEdges])

    useEffect(() => {
        const newStatementEdges = []
        const newStatementVertixes = {}
        const ids = statements.map(el => el.id)

        for(let i in statements){
            const st = statements[i]
            
            //vertixes
            let r = 15
            if(previewedNode && st.id == previewedNode.id) r = 20
            if(selectedNode && st.id == selectedNode.id) r = 25

            const vertix = {
                x: Math.max(0, Math.random() * (dimensions.width - margins.left - margins.right) + margins.left), 
                y: Math.max(0, Math.random() * (dimensions.height - margins.bottom - margins.top) + margins.top),
                r,
                node: st
            }

            if(statementVertixes[st.id] != null) {
                const v = statementVertixes[st.id]
                vertix.x = v.x
                vertix.y = v.y
            }

            newStatementVertixes[st.id] = vertix

            //edges
            const edgeSources = st.use_statements
                            .filter(id => -1 < ids.indexOf(id))
                            .map(id => ({ type: 'statement', id: id }))

            const target = { type: 'statement', id: st.id }
            const e = edgeSources.map(source => ({source, target}))
            
            newStatementEdges.push(...e)
        }

        setStatementEdges(newStatementEdges)
        setStatementVertixes(newStatementVertixes)
    }, [statements, selectedNode, previewedNode])

    useEffect(() => {
        if(!divRef) return;

        const width = divRef.current.offsetWidth
        const height = Math.max(divRef.current.offsetHeight, window.innerHeight - 400)

        setDimenstions({width, height})
    }, [divRef])

    useEffect(() => {
        if(selectedVertix && mode == 'edge-editing') {
            setPointerEdges([{
                target: {
                    type: 'pointer',
                    id: 0
                },
                source: selectedVertix
            }])
        } else {
            setPointerEdges([])
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
                    vertixes={{statement: statementVertixes, pointer: pointerVertixes}} 
                    edges={{statement: statementEdges, pointer: pointerEdges}}
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

                            const target = statementVertixes[selectedEdge.target.id].node as StatementType
                            const use_statements = target.use_statements.filter(id => id != selectedEdge.source.id)
                            
                            onUpdateNode({...target, use_statements})
                        }
                    }}

                    onPlotMouseMove={(e) => {
                        const x = e.nativeEvent.offsetX;
                        const y = e.nativeEvent.offsetY;

                        if(selectedVertix && mode == 'pointer') {
                            const node = statements.find(st => st.id == selectedVertix.id)
                            const st = statementVertixes[selectedVertix.id]

                            setStatementVertixes({...statementVertixes, [selectedVertix.id]: {x, y, r: st.r, node}})
                        } else if(mode == 'edge-editing') {
                            setPointerVertixes({'0': {x,y, r:0, node: {}}})

                            //calculating if pointer is in vertix
                            let inVertix = false;
                            
                            for(let id in statementVertixes) {
                                const v = statementVertixes[id]
                                
                                if(v.r >= Math.hypot(v.x-x, v.y-y)) {
                                    inVertix = true
                                    break;
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

                            
                            if(minIndex !== null && minDistance < 25 && !inVertix) {
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

