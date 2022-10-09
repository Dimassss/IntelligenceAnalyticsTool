//import { NodeType } from "../types/chart/graph/graph";

/*
    vertix is point on screen which represents node;
    node is record from database
*/

type NodeType = {
    id?: number,
    type?: string
}

export type VertixComponentType = {x: number, y: number, r:number, type: string, node: NodeType}
export type EdgeComponentType = {source: VertixType, target: VertixType}

export type VertixType = {
    x: number,
    y: number,
    r: number,
    node: NodeType
};

export type EdgeType = {
    source: {
        type: string,       //node type
        id: number          //node id
    },
    target: {
        type: string,       //node type
        id: number          //node id
    }
}

type Props = {
    edges: {
        [nodeType: string]: EdgeType[]
    },
    vertixes: {
        [nodeType: string]: {
            [nodeId: string]: VertixType
        }
    },
    VertixComponent: (P: VertixComponentType) => JSX.Element, //Component<{x: number, y: number, node: NodeType}>
    EdgeComponent: (P: EdgeComponentType) => JSX.Element, //Component<{source: coordType, target: coordType}>
    width: number,
    height: number,
    onPlotMouseMove: (e) => void,
    onPlotMouseLeave: (e) => void,
    onClick: (e) => void
}

export default function GraphView({ 
    VertixComponent,
    EdgeComponent,
    edges,
    vertixes,
    width = 1, 
    height = 1,
    onPlotMouseLeave,
    onPlotMouseMove,
    onClick
}: Props){
    const bgColor = '#eee';

    return (<svg viewBox={`0 0 1920 1080`} width={width} height={height} onMouseLeave={onPlotMouseLeave} onMouseMove={onPlotMouseMove} onClick={onClick}>
        <rect fill={bgColor} x={0} y={0} width={1920} height={1080}/>
        <g id="edges">
            {Object.keys(edges).map(nodeType => {
                if(!edges[nodeType]) return <></>

                return edges[nodeType].map(edge => {
                    const source = vertixes[edge.source.type][edge.source.id]
                    const target = vertixes[edge.target.type][edge.target.id]

                    let keySource = `${edge.source.type} ${edge.source.id}`
                    let keyTarget = `${edge.target.type} ${edge.target.id}`

                    const key = `${keySource} ${keyTarget}`

                    return (<EdgeComponent source={source} target={target} key={key}/>)
                })
            })}
        </g>
        <g id="vertixes">
            {Object.keys(vertixes).map(nodeType => {
                const nodeIds = Object.keys(vertixes[nodeType])
                return nodeIds.map(nodeId => {
                    const v = vertixes[nodeType][nodeId]
                    let key = `${nodeType} ${v.node.id}`

                    return (<VertixComponent x={v.x} y={v.y} r={v.r} node={v.node} type={nodeType} key={key}/>)
                })
            })}
        </g>
    </svg>)
}
