import { EdgeComponentType } from "../../../components/graph/GraphView"

export function EdgeComponentFabric(selectedEdge){
    return function ({source, target}: EdgeComponentType){
        const vect = [target.x - source.x, target.y - source.y]
        const edgeLength = Math.hypot(...vect)
        const pointerPartMaxLength = 15 + target.r //px
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
}