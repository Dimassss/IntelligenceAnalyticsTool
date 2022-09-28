import { useEffect, useRef, useState } from "react"
import * as d3 from 'd3'
import debounce from 'lodash.debounce';
import { StatementType } from "../../types/model/Statement";

/*
    vertix is point on screen which represents node;
    node is record from database
*/

type colorHEX = string
type d3Selection = any

interface VertixType {
    id?: number
    x: number
    y: number
    r: number
    fill: string
}

interface SelectedVertixType {
    id?: number
    type?: string
}

interface VertixTypeStatement extends VertixType {
    strokeWidth: number
    strokeDasharray: number
    strokeDashoffset: number
    onClick: (e) => void
}

type VertixRadiusType = {
    default: number,
    selected: number,
    preview?: number
}

type EdgeType = {
    id: {source: string, target: string},
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stroke: colorHEX,
    pointer: {
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        stroke: colorHEX,
    }
}

type configType = {
    vertixRadiuses: {
        [nodeType: string]: VertixRadiusType
    }
}

type ChartType = {
    svg?: d3Selection,
    width?: number,
    height?: number,
    drawBase?: () => ChartType,
    bgColor?: colorHEX,
    plot?: {
        vertixes: {
            statements: {
                nodes: d3Selection,
                veracity: d3Selection
            }
        },
        edges: {
            statements: {
                lines: d3Selection,
                pointers: d3Selection
            }
        },
        bg: d3Selection
    },
    events?: {
        onClickNodeStatement: (e, el: StatementType) => void,
        onDblClickNodeStatement : (e, el: StatementType) => void
    },
    vertixRadiuses?: {
        [key: string]: VertixRadiusType
    },
    selectedVertix?: SelectedVertixType,
    dimensions?: ({width, height}) => ChartType,
    bg?: (color?: colorHEX) => ChartType,
    config?: (config: configType) => ChartType,
    data?: (d?: {nodes: StatementType[], selectedNode?: StatementType}) => ChartType,
    vertixesIndexByNodeId?: {
        [key: string]: number
    },
    nodes?: StatementType[],
    vertixes?: VertixTypeStatement[],
    edges?: EdgeType[][],
    draw?: () => ChartType,
    parentUpdate?: () => ChartType,
    selectNode?: (node: StatementType) => ChartType,
    parent?: (parentSelection: d3Selection) => ChartType,
    parentSelection?: d3Selection,
    onClickNodeStatement?: (cb: (e) => void) => ChartType
    onDblClickNodeStatement?: (cb: (e) => void) => ChartType
}

const charts: {[key: number]: ChartType} = {}
let vertixCoordinates: {[key: number]: {x: number, y: number}} = {}

const createChart = ({key, useCache = true}) => {
    if(useCache && key in charts) {
        return charts[key]
    }

    //preparing chart object and svg structure

    const chart: ChartType = {
        events: {
            onClickNodeStatement: (e, el: StatementType) => {},
            onDblClickNodeStatement : (e, el: StatementType) => {}
        }
    }
    charts[key] = chart

    chart.drawBase = () => {
        chart.svg = d3.create('svg')
        chart.svg.attr('style', 'user-select:none')
            .attr('width', chart.width ? chart.width : 1)
            .attr('height', chart.height ? chart.height : 1)

        const bg = chart.svg.append('rect')
            .attr('fill', chart.bgColor ? chart.bgColor: '#3a105f')
            .attr('width', '100%')
            .attr('height', '100%')

        const edges = chart.svg.append('g').attr('class', 'edges')
        const statementE = edges.append('g').attr('class', 'statements')

        const vertixes = chart.svg.append('g').attr('class', "vertixes")
        const statementV = vertixes.append('g').attr('class', 'statements')

        chart.plot = {
            vertixes: {
                statements: {
                    nodes: statementV.append('g').attr('class', 'nodes'),
                    veracity: statementV.append('g').attr('class', 'veracity'),
                }
            },
            edges: {
                statements: {
                    lines: statementE.append('g').attr('class', 'lines'),
                    pointers: statementE.append('g').attr('class', 'pointers'),
                }
            },
            bg
        }

        return chart;
    }

    chart.drawBase()
    

    //preparing helper functions
    const nodeToVerix = (node) => {
        let r = chart.vertixRadiuses['statement'].default
        if(chart.selectedVertix && node.id === chart.selectedVertix.id)
            r = chart.vertixRadiuses['statement'].selected

        const onClickEventHandler = debounce((e) => {
            if(e.detail >= 2){
                chart.events.onDblClickNodeStatement(e, node)
            } else {
                chart.events.onClickNodeStatement(e, node)
            }
        }, 150, true)

        if(!(`statement#${node.id}` in vertixCoordinates)) {
            /*
            const cx = chart.width/2
            const cy = chart.height/2
            const alpha = 2* Math.PI * chart.vertixesIndexByNodeId[`statement#${node.id}`] / chart.nodes.length
            const r = 0.5 * Math.min(chart.width, chart.height) - 50

            const x = cx + r * Math.cos(alpha)
            const y = cy + r * Math.sin(alpha)
            */

            vertixCoordinates[`statement#${node.id}`] = {
                x: 50 + Math.random() * (chart.width - 100), 
                y: 50 + Math.random() * (chart.height - 100)
            }
        }
        let {x, y} = vertixCoordinates[`statement#${node.id}`]

        return {
            id: node.id,
            type: 'statement',
            x,
            y,
            r,
            fill: '#000',
            stroke: '#F00',
            strokeWidth: 2,
            strokeDasharray: 2 * Math.PI * r,
            strokeDashoffset: 2 * Math.PI * r * (3 -  node.veracity / 100),
            onClick: onClickEventHandler
        }
    };

    const createDirectedEdge = (source: VertixType, target: VertixType) => {
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
            id: {source: `statement#${source.id}`, target: `statement#${target.id}`},
            x1: source.x,
            y1: source.y,
            x2: target.x,
            y2: target.y,
            stroke: '#000',
            pointer
        }
    }

    const createDirectedEdgesToNode = (targetVertix, sourceVertixes) => {
        const target = targetVertix

        const edges = sourceVertixes.map(source => {
            return createDirectedEdge(source, target)
        }).filter(el => el !== undefined)

        return edges
    }

    //Creating methods
    //chart obj update
    
    chart.dimensions = ({width, height}) => {
        vertixCoordinates = {}

        chart.width = width
        chart.height = height

        chart.svg
            .attr('width', chart.width)
            .attr('height', chart.height)

        chart.bg()

        return chart
    }

    chart.bg = (color) => {
        chart.bgColor = color ? color : chart.bgColor;
        
        chart.plot.bg.attr('fill', chart.bgColor ? chart.bgColor: '#3a105f')

        return chart
    }

    chart.config = ({vertixRadiuses}: configType) => {
        chart.vertixRadiuses = vertixRadiuses

        return chart
    }

    chart.data = ({nodes, selectedNode}: any = {}) => {
        chart.vertixesIndexByNodeId = {}

        if(nodes !== undefined) chart.nodes = nodes
        if(selectedNode !== undefined) {
            chart.selectedVertix = {
                id: selectedNode.id,
                type: 'statement'
            }
        }

        chart.vertixes = chart.nodes.map((node, i) => {
            chart.vertixesIndexByNodeId[`statement#${node.id}`] = i;

            return nodeToVerix(node)
        })

        chart.edges = chart.nodes.map((node) => {
            const i = chart.vertixesIndexByNodeId[`statement#${node.id}`]
            const target = chart.vertixes[i]

            const sources = node.use_statements.map(n_id => {
                if(!(`statement#${n_id}` in chart.vertixesIndexByNodeId)) {
                    return undefined
                }

                const j = chart.vertixesIndexByNodeId[`statement#${n_id}`]

                return chart.vertixes[j]
            }).filter(el => el !== undefined)

            return createDirectedEdgesToNode(target, sources)
        })

        return chart
    }

    chart.draw = () => {
        chart.plot.vertixes.statements.veracity
            .selectAll('circle')
            .data(chart.vertixes)
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
            .on('click', (e, d) => d.onClick(e))

        chart.plot.vertixes.statements.nodes
            .selectAll('circle')
            .data(chart.vertixes)
            .join('circle')
            .attr('r', d => d.r + 2)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => d.fill)

        const edges = chart.edges.reduce((a,b) => [...a, ...b], [])

        chart.plot.edges.statements.lines
            .selectAll('line')
            .data(edges)
            .join('line')
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2)
            .attr('stroke', d => d.stroke)

        chart.plot.edges.statements.pointers
            .selectAll('line')
            .data(edges)
            .join('line')
            .attr('x1', d => d.pointer.x1)
            .attr('y1', d => d.pointer.y1)
            .attr('x2', d => d.pointer.x2)
            .attr('y2', d => d.pointer.y2)
            .attr('stroke', d => d.pointer.stroke)

        
        chart.parentUpdate()
        
        return chart
    }
    
    chart.selectNode = (node) => {
        if(!node) {
            return chart;
        }

        chart.selectedVertix = {
            id: node.id,
            type: 'statement'
        }

        chart.data()
        chart.draw()

        return chart
    }

    chart.parentUpdate = () => {
        if(!chart.parentSelection) return;
        chart.parentSelection.selectAll('*').remove()
        chart.parentSelection.append(() => chart.svg.node())

        return chart
    }

    chart.parent = (parentSelection) => {
        chart.parentSelection = parentSelection
        chart.parentUpdate()
        return chart
    }

    /*chart.updateNode = (node) => {
        const i = chart.vertixesIndexByNodeId[`statement#${node.id}`]
        const target = nodeToVerix(node)
        const sources = node.use_statements.map(n_id => {
            if(!(`statement#${n_id}` in chart.vertixesIndexByNodeId)) {
                return undefined
            }

            const j = chart.vertixesIndexByNodeId[`statement#${n_id}`]

            return chart.vertixes[j]
        }).filter(el => el !== undefined)

        chart.vertixes[i] = target
        chart.edges[i] = sources

        chart.draw()

        return chart
    }*/

    //chart events

    chart.onClickNodeStatement = (cb) => {
        chart.events.onClickNodeStatement = cb
        
        return chart.data()
    }

    chart.onDblClickNodeStatement = (cb) => {
        chart.events.onDblClickNodeStatement = cb

        return chart.data()
    }

    return chart
}

type Props = {
    chartKey?: number,
    statements: StatementType[],
    width: number,
    height: number,
    onClick?: (e?: any, node?: StatementType) => void,
    onDblClick?: (e?: any, node?: StatementType) => void,
    selectedNode: StatementType
}

export default function StatementGraph({ 
    chartKey, 
    statements, 
    selectedNode,
    width, 
    height,
    onClick = () => {},
    onDblClick = () => {}
}: Props){
    const divRef = useRef()
    const [chartCreated, setChartCreated] = useState(false)

    useEffect(() => {
        createChart({key: chartKey})
        .config({
            vertixRadiuses: {
                statement: {
                    selected: 20,
                    default: 10
                }
            }
        })

        d3.select(divRef.current).call(charts[chartKey].parent)
        setChartCreated(true)
    }, [])

    useEffect(() => {
        if(!chartCreated) return;

        charts[chartKey].data({nodes: statements}).drawBase().draw()
    }, [statements, chartCreated])

    useEffect(() => {
        if(!chartCreated) return;

        charts[chartKey].dimensions({width, height}).drawBase().draw()
    }, [width, height, chartCreated])

    useEffect(() => {
        if(!chartCreated) return;

        charts[chartKey].selectNode(selectedNode).drawBase().draw()
    }, [selectedNode, chartCreated])

    useEffect(() => {
        if(!chartCreated) return;
        
        charts[chartKey].onClickNodeStatement(onClick).drawBase().draw()
    }, [onClick, chartCreated])

    useEffect(() => {
        if(!chartCreated) return;
        
        charts[chartKey].onDblClickNodeStatement(onDblClick).drawBase().draw()
    }, [onDblClick, chartCreated])

    useEffect(() => {
        if(!chartCreated) return;

        d3.select(divRef.current).call(charts[chartKey].parent)
        charts[chartKey].drawBase().draw()
    })

    return (<div ref={divRef} style={{display: 'block', height, width}}/>)
}
