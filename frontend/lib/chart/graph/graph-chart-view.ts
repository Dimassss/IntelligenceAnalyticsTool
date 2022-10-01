import * as d3 from 'd3'
import debounce from 'lodash.debounce';

import { EdgeType, NodeType, VertixType } from "../../../types/chart/graph/graph";
import { ChartType } from '../../../types/chart/graph/graph.config';
import { d3Selection } from '../../../types/global';
import { StatementType } from "../../../types/model/Statement";
import { createChart } from "./graph-chart";


const createStatementVertixBuilder = (mode, onClickNode, onDblClickNode, onEdgeMake) => {
    const onClickEventHandler = {
        'pointer': debounce((e, node, chart) => {
            if(e.detail >= 2){
                onDblClickNode(e, node)
            } else {
                onClickNode(e, node)
            }
        }, 150, true),
        'edge-editing': (e, node, chart) => {
            const sourceNode = chart.events.createEdge.sourceNode

            if(!sourceNode) chart.events.createEdge.sourceNode = node
            else {
                if(sourceNode.type == node.type && sourceNode.id == node.id){
                    chart.events.createEdge.sourceNode = null
                } else {
                    const targetNode = node
                    onEdgeMake(chart.events.createEdge.sourceNode, targetNode)
                    chart.events.createEdge.sourceNode = null
                }
            }
        }
    }

    return (vertix: VertixType, node: NodeType) => {
        const n = node as StatementType

        return Object.assign(vertix, {
            fill: '#000',
            stroke: '#F00',
            strokeWidth: 2,
            strokeDasharray: 2 * Math.PI * vertix.r,
            strokeDashoffset: 2 * Math.PI * vertix.r * (3 -  n.veracity / 100),
            onClick: onClickEventHandler
        })
    }
}

const createStatementEdgeBuilder = () => {
    return (source: VertixType, target: VertixType, chart: ChartType): EdgeType => {
        const vect = [target.x - source.x, target.y - source.y]
        const edgeLength = Math.hypot(...vect)
        const pointerPartMaxLength = 15 + target.r //px
        const redPartLengthRatio = Math.min(1, pointerPartMaxLength / edgeLength)
        const pointer = {
            x1: target.x - redPartLengthRatio * vect[0],
            y1: target.y - redPartLengthRatio * vect[1],
            x2: target.x,
            y2: target.y,
            stroke: '#f00',
        } 

        return {
            source,
            target,
            x1: source.x,
            y1: source.y,
            x2: target.x,
            y2: target.y,
            stroke: '#000',
            pointer
        }
    }
}

const createStatementVertixDrawer = (mode) => {

    const drawAll = (selection: d3Selection, vertixes: VertixType[], chart: ChartType) => {
        const nodesSel = selection.select('g.nodes').node()
            ? selection.select('g.nodes')
            : selection.append('g').attr('class', 'nodes')
        
        const veracitySel = selection.select('g.veracity').node()
            ? selection.select('g.veracity')
            : selection.append('g').attr('class', 'veracity')

            
        veracitySel.selectAll('circle')
            .data(vertixes)
            .join('circle')
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => 'none')
            .attr('stroke', d => d.stroke)
            .attr('stroke-width', d => d.strokeWidth)
            .attr('stroke-dasharray', d => d.strokeDasharray)
            .attr('stroke-dashoffset', d => d.strokeDashoffset)
            .attr('transform', d => `rotate(-90 ${d.x} ${d.y})`)

        nodesSel.selectAll('circle')
            .data(vertixes)
            .join('circle')
            .attr('r', d => d.r + 2)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => d.fill)
            .on('click', d => null)
            .on('mousedown', d => null)
            .on('mouseup', d => null)
            .on('click', (e, d) => d.onClick[mode](e, d.node, chart))
            .on('mousedown', (e, d) => {
                chart.events.moveNode = d.node
            })
            .on('mouseup', (e, d) => {
                chart.events.moveNode = null
            })
            .on('mouseover', (e, d) => {
                chart.events.deleteEdgeDisabled = true
            })
            .on('mouseleave', (e, d) => {
                chart.events.deleteEdgeDisabled = false
            })
    }

    return drawAll
}

const createStatementEdgeDrawer = () => {
    return (selection, edges: { [targetNodeId: string]: EdgeType[] }) => {
        const linesSel = selection.select('g.lines').node()
            ? selection.select('g.lines')
            : selection.append('g').attr('class', 'lines')
        
        const pointersSel = selection.select('g.pointers').node()
            ? selection.select('g.pointers')
            : selection.append('g').attr('class', 'pointers')

        linesSel.selectAll('g')
            .data(Object.keys(edges))
            .join('g')
            .attr('class', d => `statementLine-${d}`)

        pointersSel.selectAll('g')
            .data(Object.keys(edges))
            .join('g')
            .attr('class', d => `statementLine-${d}`)
        
        for(let nodeID in edges) {
            const E = edges[nodeID]

            linesSel.select(`g.statementLine-${nodeID}`)
                .selectAll('line')
                    .data(E)
                    .join('line')
                    .attr('x1', d => d.x1)
                    .attr('y1', d => d.y1)
                    .attr('x2', d => d.x2)
                    .attr('y2', d => d.y2)
                    .attr('stroke', d => d.stroke)

            pointersSel.select(`g.statementLine-${nodeID}`)
                .selectAll('line')
                    .data(E)
                    .join('line')
                    .attr('x1', d => d.pointer.x1)
                    .attr('y1', d => d.pointer.y1)
                    .attr('x2', d => d.pointer.x2)
                    .attr('y2', d => d.pointer.y2)
                    .attr('stroke', d => d.pointer.stroke)
                    .attr('stroke-width', 4)
        }

    }
}

const createStatementVertixSourceGetters = () => {
    return (
        nodeTarget: NodeType, 
        getVertixOfNode: (node: NodeType) => VertixType
    ) => {
        const node = nodeTarget as StatementType

        const sources = node.use_statements.map(n_id => {
            return getVertixOfNode({id: n_id, type: 'statement'})
        }).filter(el => el != null)

        return sources
    }
}

const createSvgDrawer = (mode, onEdgeDelete) => {
    return (
        chart: ChartType
    ) => {
        chart.events.moveNode = null    //here is stored node, which is currently moving
        chart.events.createEdge = {sourceNode: null, targetNode: null}
        chart.events.deleteEdge = null
        chart.events.deleteEdgeDisabled = false

        chart.plot.svg
            .on('mousemove', null)
            .on('mouseleave', null)
            .on('click', null)
            .on('mousemove', (e) => {
                const x = e.offsetX;
                const y = e.offsetY;

                if(chart.events.moveNode && mode == 'pointer') {
                    chart.updateNode(chart.events.moveNode, {x, y})
                } else if(mode == 'edge-editing') {
                    // Calculating possible edge to delete
                    chart.events.deleteEdge = null

                    if(!chart.events.createEdge.sourceNode) {
                        let minDistanceNodeIndex: [string, string, string] = [null, null, null]   //[nodeType, targetNodeId, i]
                        let minDistance = chart.config.width + chart.config.height + 1

                        for(let nodeType in chart.state.edges) {
                            for(let targetNodeId in chart.state.edges[nodeType]) {
                                for(let i in chart.state.edges[nodeType][targetNodeId]) {
                                    const p = chart.state.edges[nodeType][targetNodeId][i].pointer
                                    const dist = Math.hypot(x - (p.x1 + p.x2) / 2, y - (p.y1 + p.y2) / 2)

                                    if(dist < minDistance) {
                                        minDistance = dist
                                        minDistanceNodeIndex = [nodeType, targetNodeId, i]
                                    }
                                }
                            }
                        }

                        const nodeType = minDistanceNodeIndex[0]
                        const targetNodeId = minDistanceNodeIndex[1]
                        const i = minDistanceNodeIndex[2]

                        const edge = minDistanceNodeIndex && minDistance < 30 && !chart.events.deleteEdgeDisabled
                            ? chart.state.edges[nodeType][targetNodeId][i]
                            : null

                            
                        chart.plot.edges.select('g.pointers')
                            .select(`g.statementLine-${targetNodeId}`)
                            .selectAll('line')
                            .data(chart.state.edges[nodeType][targetNodeId])
                            .join('line')
                            .attr('stroke', d => edge 
                                                    && edge.target.node.id == d.target.node.id 
                                                    && edge.source.node.id == d.source.node.id 
                                                ? 'rgba(200,0,0,150)' 
                                                : d.pointer.stroke
                            )
                            .attr('stroke-width', 4)

                        chart.events.deleteEdge = edge
                    }
                    
                    // Drawing new edge
                    let uncreatedEdgeSelection = chart.plot.svg.select('g.uncreated-edge-selection')

                    if(chart.events.createEdge.sourceNode) {
                        let source = chart.getVertixOfNode(chart.events.createEdge.sourceNode)
                        let target = chart.getVertixOfNode(chart.events.createEdge.targetNode)

                        if(!target) target = {...target, x, y}
                        const edge = {
                            x1: source.x,
                            y1: source.y,
                            x2: target.x,
                            y2: target.y,
                            stroke: '#000',
                            strokeWidth: 2
                        } 

                        const vect = [target.x - source.x, target.y - source.y]
                        const edgeLength = Math.hypot(...vect)
                        const pointerPartMaxLength = 30 //px
                        const redPartLengthRatio = Math.min(1, pointerPartMaxLength / edgeLength)
                        const pointer = {
                            x1: target.x - redPartLengthRatio * vect[0],
                            y1: target.y - redPartLengthRatio * vect[1],
                            x2: target.x,
                            y2: target.y,
                            stroke: '#f00',
                            strokeWidth: 4
                        } 

                        uncreatedEdgeSelection.selectAll('line')
                            .data([edge, pointer])
                            .join('line')
                            .attr('x1', d => d.x1)
                            .attr('y1', d => d.y1)
                            .attr('x2', d => d.x2)
                            .attr('y2', d => d.y2)
                            .attr('stroke', d => d.stroke)
                            .attr('stroke-width', d => d.strokeWidth)
                    } else {
                        uncreatedEdgeSelection.selectAll('*').remove()
                    }
                }
            })
            .on('mouseleave', (e) => {
                chart.events.moveNode = null
            })
            .on('click', (e) => {
                if(mode == 'edge-editing'){
                    // Delete edge
                    if(chart.events.deleteEdge) {
                        const edge = chart.events.deleteEdge
                        onEdgeDelete(edge.source.node, edge.target.node)
                        chart.events.deleteEdge = null
                    }
                }
            })

        chart.plot.svg.selectAll('g.uncreated-edge-selection')
            .data([1])
            .join('g')
            .attr('class', 'uncreated-edge-selection')
            .lower()
            .selectAll('*')
            .remove()
        chart.plot.svg.select('rect#bg').lower()
    }
}

const isNodeSourceOfTarget = {
    statement: (target, source) => {
        return target.use_statements.indexOf(source.id) > -1
    }
}

let chartConfig = (mode, onClickNode, onDblClickNode, onEdgeMake, onEdgeDelete, width, height) => ({
    width, 
    height,
    vertixBuilders: {
        statement: createStatementVertixBuilder(mode, onClickNode, onDblClickNode, onEdgeMake)
    },
    vertixDrawers: {
        statement: createStatementVertixDrawer(mode)
    },
    vertixSourcesGetters: {
        statement: createStatementVertixSourceGetters()
    },
    edgeBuilders: {
        statement: createStatementEdgeBuilder()
    },
    edgeDrawers: {
        statement: createStatementEdgeDrawer()
    },
    svgDrawer: createSvgDrawer(mode, onEdgeDelete),
    vertixes: {
        statement: {
            radius: {
                default: 15,
                selected: 25,
                previewed: 20
            }
        }
    },
    isNodeSourceOfTarget
})



type Props = {
    key: number, 
    mode: string
    useCache: boolean, 
    width: number, 
    height: number,
    onClickNode: (e, node: NodeType) => void,
    onDblClickNode: (e, node: NodeType) => void,
    onEdgeMake: (source: NodeType, target: NodeType) => void,
    onEdgeDelete: (source: NodeType, target: NodeType) => void,
}

export function createGraphChartView({
    key, 
    mode = 'pointer',
    useCache, 
    width, 
    height,
    onClickNode,
    onDblClickNode,
    onEdgeMake,
    onEdgeDelete
}: Props) {
    const chart = createChart({key, useCache})
    chart.setConfig(chartConfig(mode, onClickNode, onDblClickNode, onEdgeMake, onEdgeDelete, width, height))

    const c = {
        data(statements){
            chart.data({ nodes: { statement: statements } })
            return c
        },
        draw(parentNode){
            chart.draw(d3.select(parentNode))
            return c
        },
        selectStatement(node: StatementType){
            chart.selectNode(node)
            return c
        },
        previewStatement(node: StatementType){
            // TODO: 
            //      implement preview code here
            return c
        },
        changeMode(mode) {
            chart.setConfig(chartConfig(mode, onClickNode, onDblClickNode, onEdgeMake, onEdgeDelete, width, height))
            return c
        },
    }

    return c
}