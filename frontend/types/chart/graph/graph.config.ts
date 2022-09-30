import { colorHEX, d3Selection } from "../../global"
import { EdgeType, NodeType, VertixType } from "./graph"


export type VertixRadiusType = {
    default: number,
    selected: number,
    previewed?: number
}

export type VertixConfigType = {
    radius: VertixRadiusType
}

export type VertixToNodeIndexMapType = {
    [nodeType: string]: {
        [key: string]: number
    }
}

export type ChartConfigType = {
    vertixes?: {
        [nodeType: string]: VertixConfigType
    },
    width?: number,
    height?: number,
    bgColor?: colorHEX,
    vertixBuilders: {
        //adds customized properties to object, which will be used in vertix drawers
        [nodeType: string]: (vertix: VertixType, node: NodeType) => VertixType
    },
    vertixDrawers: {
        //adds customized properties to selection, from customiezed vertix
        [nodeType: string]: (vertixSelection: d3Selection, vertixes: VertixType[], chart: ChartType) => void
    },
    vertixSourcesGetters: {
        [nodeType: string]: (
            nodeTarget: NodeType, 
            getVertixOfNode: (node: NodeType) => VertixType
        ) => VertixType[]
    },
    edgeBuilders: {
        [nodeType: string]: ( source: VertixType, target: VertixType ) => EdgeType
    },
    edgeDrawers: {
        [nodeType: string]: (
                edgeSelection: d3Selection,
                edges: {
                    [targetNodeId: string]: EdgeType[]
                }, 
                chart: ChartType
            ) => void
    },
    svgDrawer: (chart: ChartType) => void,
    isNodeSourceOfTarget: {
        [targetNodeType: string]: (target: NodeType, source: NodeType) => boolean
    }
}

export type ChartStateType = {
    nodes: {[nodeType: string]: NodeType[]},
    selectedNode: NodeType,
    previewedNode: NodeType,
    vertixToNodeIndexMap: VertixToNodeIndexMapType,
    vertixes: {
        [nodeType: string]: VertixType[]
    },
    edges: {
        [nodeType: string]: {
            [targetNodeId: string]: EdgeType[]
        }
    }
}

export type ChartPlotType = {
    svg?: d3Selection,
    parentSelection?: d3Selection,
    vertixes: d3Selection,
    edges: d3Selection,
    bg: d3Selection
}

export type ChartType = {
    state: ChartStateType,
    plot?: ChartPlotType,
    events?: {[key: string]: any}, //this is object for storing states of events
    config?: ChartConfigType,
    setConfig?: (config: ChartConfigType) => ChartType,
    dimensions?: ({width, height}) => ChartType,
    bg?: (color?: colorHEX) => ChartType,
    data?: (
        d?: {
            nodes?: {
                [nodeType: string]: NodeType[]
            }
        }
    ) => ChartType,
    draw?: (parentSelection: d3Selection) => ChartType,
    selectNode?: (node: NodeType) => ChartType,
    parent?: (parentSelection: d3Selection) => ChartType,
    onClickNode?: (cb: (e, node: NodeType) => void) => ChartType,
    onDblClickNode?: (cb: (e, node: NodeType) => void) => ChartType,
    updateNode?: (node: NodeType, coord: {x: number, y: number}) => ChartType,
    getVertixOfNode?: (node: NodeType) => VertixType
}