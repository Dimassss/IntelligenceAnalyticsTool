import * as d3 from 'd3'
import debounce from 'lodash.debounce';

import { EdgeType, NodeType, VertixType } from "../../../types/chart/graph/graph";
import { ChartType } from '../../../types/chart/graph/graph.config';
import { d3Selection } from '../../../types/global';
import { StatementType } from "../../../types/model/Statement";
import { createChart } from "./graph-chart";


const createStatementVertixBuilder = (onClickNode, onDblClickNode) => {
    const onClickEventHandler = debounce((e, node) => {
        if(e.detail >= 2){
            onDblClickNode(e, node)
        } else {
            onClickNode(e, node)
        }
    }, 150, true)

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
    return (source: VertixType, target: VertixType): EdgeType => {
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

const createStatementVertixDrawer = () => {

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
            .attr('fill', d => d.fill)
            .attr('stroke', d => d.stroke)
            .attr('stroke-width', d => d.strokeWidth)
            .attr('stroke-dasharray', d => d.strokeDasharray)
            .attr('stroke-dashoffset', d => d.strokeDashoffset)
            .attr('transform', d => `rotate(-90 ${d.x} ${d.y})`)
            .on('click', null)
            .on('click', (e, d) => d.onClick(e, d.node))
            .on('mousedown', (e, d) => {
                chart.events.moveNode = d.node
            })
            .on('mouseup', (e, d) => {
                chart.events.moveNode = null
            })

        nodesSel.selectAll('circle')
            .data(vertixes)
            .join('circle')
            .attr('r', d => d.r + 2)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => d.fill)
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

const createSvgDrawer = () => {
    return (
        chart: ChartType
    ) => {
        chart.events.moveNode = null    //here is stored node, which is currently moving

        chart.plot.svg
            .on('mousemove', (e) => {
                if(chart.events.moveNode) {
                    const x = e.offsetX;
                    const y = e.offsetY;
                    
                    chart.updateNode(chart.events.moveNode, {x, y})
                }
            })
            .on('mouseleave', (e) => {
                chart.events.moveNode = null
            })
    }
}

const isNodeSourceOfTarget = {
    statement: (target, source) => {
        return target.use_statements.indexOf(source.id) > -1
    }
}



type Props = {
    key: number, 
    useCache: boolean, 
    width: number, 
    height: number,
    onClickNode: (e, node: NodeType) => void,
    onDblClickNode: (e, node: NodeType) => void
}

export function createGraphChartView({
    key, 
    useCache, 
    width, 
    height,
    onClickNode,
    onDblClickNode
}: Props) {
    const chart = createChart({key, useCache})

    chart.setConfig({
        width, 
        height,
        vertixBuilders: {
            statement: createStatementVertixBuilder(onClickNode, onDblClickNode)
        },
        vertixDrawers: {
            statement: createStatementVertixDrawer()
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
        svgDrawer: createSvgDrawer(),
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
        }
    }

    return c
}