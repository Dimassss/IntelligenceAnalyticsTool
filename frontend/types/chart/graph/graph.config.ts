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
        [nodeType: string]: (vertixSelection: d3Selection, vertixes: VertixType[]) => void
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
            }
        ) => void
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
    vertixes: {
        [nodeType: string]: d3Selection
    },
    edges: {
        [nodeType: string]: d3Selection
    },
    bg: d3Selection
}

export type ChartEventsType = {
    onClickNode: (e, el: NodeType) => void,
    onDblClickNode : (e, el: NodeType) => void
}

export type ChartType = {
    state: ChartStateType,
    plot?: ChartPlotType,
    events?: ChartEventsType,
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
    onClickNode?: (cb: (e, node: NodeType) => void) => ChartType
    onDblClickNode?: (cb: (e, node: NodeType) => void) => ChartType
}