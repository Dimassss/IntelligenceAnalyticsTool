import { useEffect, useRef, useState } from "react"
import * as d3 from 'd3'
import { StatementType } from "../types/model/Statement";
import { createChart } from "../lib/chart/graph/graph-chart";
import { createGraphChartView } from "../lib/chart/graph/graph-chart-view";

/*
    vertix is point on screen which represents node;
    node is record from database
*/



type Props = {
    chartKey?: number,
    statements: StatementType[],
    width: number,
    height: number,
    selectedNode: StatementType,
    previewedNode: StatementType,
    onPreviewedNode?: (node?: StatementType) => void,
    onSelectNode?: (node?: StatementType) => void
}

export default function GraphView({ 
    chartKey, 
    statements, 
    width = 1, 
    height = 1,
    selectedNode,
    previewedNode,
    onPreviewedNode = () => {},
    onSelectNode = () => {}
}: Props){
    const divRef = useRef()
    const chart = createGraphChartView({
        key: chartKey,
        useCache: true,
        width,
        height,
        onClickNode: (e, node) => {
            onPreviewedNode(node as StatementType)
        },
        onDblClickNode: (e, node) => {
            onSelectNode(node as StatementType)
        }
    })

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

    return (<div ref={divRef} style={{display: 'block', height, width}}/>)
}
