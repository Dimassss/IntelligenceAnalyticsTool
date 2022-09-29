import { colorHEX } from "../../global"

export interface NodeType {
    id?: number,
    type?: string 
}

export interface NodeTypeExtended extends NodeType {
    [key: string]: any
}

export interface VertixType {
    x: number
    y: number
    r: number
    node: NodeType
}

export interface VertixTypeExtended extends VertixType {
    [key: string]: any
}

export interface VertixTypeStatement extends VertixTypeExtended {
    fill: string
    strokeWidth: number
    strokeDasharray: number
    strokeDashoffset: number
    onClick: (e) => void
}

export type EdgeType = {
    source: VertixType,
    target: VertixType,
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