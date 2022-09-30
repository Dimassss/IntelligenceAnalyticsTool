import { useEffect, useRef, useState } from "react"
import { StatementType } from "../types/model/Statement";
import { createGraphChartView } from "../lib/chart/graph/graph-chart-view";
import { NodeType } from "../types/chart/graph/graph";

/*
    vertix is point on screen which represents node;
    node is record from database
*/



type Props = {
    mode: string,
    chartKey?: number,
    statements: StatementType[],
    width: number,
    height: number,
    selectedNode: StatementType,
    previewedNode: StatementType,
    onPreviewedNode?: (node?: StatementType) => void,
    onSelectNode?: (node?: StatementType) => void,
    onLinkMake?: (source: NodeType, target: NodeType) => void
}

export default function GraphView({ 
    mode,
    chartKey, 
    statements, 
    width = 1, 
    height = 1,
    selectedNode,
    previewedNode,
    onPreviewedNode = () => {},
    onSelectNode = () => {},
    onLinkMake = () => {}
}: Props){
    const divRef = useRef()
    const chartProps = {
        key: chartKey,
        mode,
        useCache: true,
        width,
        height,
        onClickNode: (e, node) => {
            onPreviewedNode(node as StatementType)
        },
        onDblClickNode: (e, node) => {
            onSelectNode(node as StatementType)
        },
        onLinkMake
    }
    let [chart, setChart] = useState(createGraphChartView(chartProps))

    useEffect(() => {
        if(divRef.current === undefined) return;

        chart.data(statements)
            .selectStatement(selectedNode)
            .previewStatement(previewedNode)
            .draw(divRef.current);
    }, [])

    useEffect(() => {
        if(divRef.current === undefined) return;

        chart.draw(divRef.current);
    }, [width, height, statements, selectedNode, previewedNode])

    useEffect(() => {
        if(divRef.current === undefined) return;

        chart.data(statements).draw(divRef.current);
    }, [statements])

    useEffect(() => {
        if(divRef.current === undefined) return;

        chart.selectStatement(selectedNode).draw(divRef.current);
    }, [selectedNode])

    useEffect(() => {
        if(divRef.current === undefined) return;

        chart.previewStatement(previewedNode).draw(divRef.current);
    }, [previewedNode])

    useEffect(() => {
        createGraphChartView(chartProps)
            .changeMode(mode)
            .draw(divRef.current);
    }, [mode])

    return (<div ref={divRef} style={{display: 'block', height, width}}/>)
}
