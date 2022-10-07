import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VertixComponentType } from "../../../components/graph/GraphView";
import { getPreviewedRecord, getSelectedRecord, setPreviewedRecord, setSelectedRecord } from "../../../store/recordsSlice";
import { StatementType } from "../../../types/model/Statement";

export function VertixComponentFactory({
    mode, 
    selectedVertix, 
    setSelectedVertix, 
    vertixes, 
    setMouseVertix, 
    onUpdateNode, 
    vertixMouseDown, 
    setVertixMouseDown
}){  
    return function({x, y, r, type, node}: VertixComponentType){  
        const dispatch =  useDispatch() 
        const selectedNode = useSelector(getSelectedRecord)
        const previewedNode = useSelector(getPreviewedRecord)
        
        if(type == 'pointer' || r <= 0) return <></>

        const startVertixMove = () => {
            let v: any = vertixMouseDown ? {...vertixMouseDown} : {type, id: node.id, x, y}
            v.clickCount = vertixMouseDown ? vertixMouseDown.clickCount : 0;
            v.clickCount += 1

            setVertixMouseDown(v)
            setSelectedVertix({type, id: node.id})
        }

        const onClickVertixPointerMode = (e) => {
            setSelectedVertix(null)

            if(vertixMouseDown && 
                vertixMouseDown.id == node.id && 
                vertixMouseDown.type == type &&
                Math.hypot(vertixMouseDown.x - x, vertixMouseDown.y - y) < 3
            ){
                if(vertixMouseDown.clickCount <= 1) {
                    const stopTimeout = setTimeout(() => {
                        dispatch(setPreviewedRecord(['statement', vertixes[type][vertixMouseDown.id].node]))
                        setVertixMouseDown(null)
                    }, 150)

                    const st = {...vertixMouseDown, stopTimeout}
                    setVertixMouseDown(st)
                } else {
                    clearTimeout(vertixMouseDown.stopTimeout)

                    dispatch(setSelectedRecord(['statement', vertixes[type][vertixMouseDown.id].node]))
                    setVertixMouseDown(null)
                }
            } else {
                if(vertixMouseDown && vertixMouseDown.stopTimeout !== undefined) {
                    clearTimeout(vertixMouseDown.stopTimeout)
                }

                setVertixMouseDown(null)
            }
        }

        const onClickVertixEdgeEditingMode = (e) => {
            if(!selectedVertix) {
                setMouseVertix({x, y, r:0, node: {}})
            } else {
                const target = node as StatementType

                let use_statements = [...target.use_statements]
                if(!use_statements.includes(selectedVertix.id) && selectedVertix.id != target.id) {
                    use_statements.push(selectedVertix.id)
                }

                onUpdateNode(type, {...target, use_statements})
            }
            
            setSelectedVertix(!selectedVertix ? {type, id: node.id} : null)
        }

        return (<g 
            onMouseDown={e => {
                if(mode == 'pointer') {
                    startVertixMove()
                }
            }}
            onMouseUp={e => {
                if(mode == 'pointer') {
                    onClickVertixPointerMode(e)
                }
            }}
            onClick={e => {
                if(mode == 'edge-editing'){
                    onClickVertixEdgeEditingMode(e)
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
}