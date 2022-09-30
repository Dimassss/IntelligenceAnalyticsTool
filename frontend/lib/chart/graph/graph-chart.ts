import { NodeType, VertixType } from "../../../types/chart/graph/graph"
import { ChartConfigType, ChartType } from "../../../types/chart/graph/graph.config"

const charts: {[key: number]: ChartType} = {}

let vertixCoordinates: {
    [nodeType: string]: {
        [id: number]: {x: number, y: number}
    }
} = {}

export const createChart = ({key, useCache = true}) => {
    if(useCache && key in charts) {
        return charts[key]
    }

    /**
     * Preparing chart object and svg structure
     */

    charts[key] = {
        events: {},
        state: {
            nodes: {},
            selectedNode: null,
            previewedNode: null,
            vertixToNodeIndexMap: {},
            vertixes: {},
            edges: {},
        },
        config: {
            bgColor: '#3a105f',
            width: 1,
            height: 1,
            vertixes: {},
            vertixBuilders: {},
            vertixDrawers: {},
            vertixSourcesGetters: {},
            edgeBuilders: {},
            edgeDrawers: {},
            svgDrawer: () => {},
            isNodeSourceOfTarget: {}
        },
        plot: {
            vertixes: {
                statements: {
                    nodes: null,
                    veracity: null
                }
            },
            edges: {
                statements: {
                    lines: null,
                    pointers: null,
                }
            },
            bg: null
        }
    }
    const chart = charts[key]

    /**
     * preparing helper functions
     */

    const nodeToVerix = (node: NodeType) => {
        let r = chart.config.vertixes[node.type].radius.default
        if(chart.state.selectedNode && node.id === chart.state.selectedNode.id)
            r = chart.config.vertixes[node.type].radius.selected
        else if(chart.state.previewedNode && node.id === chart.state.previewedNode.id)
            r = chart.config.vertixes[node.type].radius.previewed

        if(!(node.type in vertixCoordinates)) {
            vertixCoordinates[node.type] = {}
        }
        if(!(node.id in vertixCoordinates[node.type])) {
            const x = 50 + Math.random() * (chart.config.width - 100)
            const y = 50 + Math.random() * (chart.config.height - 100)

            vertixCoordinates[node.type][node.id] = { x, y }
        }

        const {x, y} = vertixCoordinates[node.type][node.id]
        const builder = chart.config.vertixBuilders[node.type] ? chart.config.vertixBuilders[node.type] : (el) => el

        return builder({
            node,
            x,
            y,
            r
        }, node)
    };

    type createEdgesToNodeArgumentType = {
        target: VertixType, 
        sources: VertixType[]
    }
    const createEdgesToNode = ({ target, sources } : createEdgesToNodeArgumentType) => {
        const builder = chart.config.edgeBuilders[target.node.type]

        const edges = sources.map(source => {
            return builder(source, target)
        }).filter(el => el !== undefined)

        return edges
    }

    const rebuildVertix = (n: NodeType) => {
        const j = chart.state.vertixToNodeIndexMap[n.type][n.id]
        chart.state.vertixes[n.type][j] = nodeToVerix(n)
    }

    const rebuildEdgesOfNode = (n: NodeType) => {
        const target = chart.getVertixOfNode(n)

        if(target == null) return;

        const sourcesGetter = chart.config.vertixSourcesGetters[n.type]

        chart.state.edges[n.type][n.id] = createEdgesToNode({
            target, 
            sources: sourcesGetter(
                n, 
                chart.getVertixOfNode
            )
        })
    }

    /**
     * Creating methods
     */

    //chart obj update
    chart.setConfig = ({
        vertixes, 
        width, 
        height, 
        bgColor, 
        vertixBuilders, 
        vertixDrawers, 
        vertixSourcesGetters, 
        edgeBuilders, 
        edgeDrawers,
        svgDrawer,
        isNodeSourceOfTarget
    }: ChartConfigType) => {
        if(vertixes !== undefined) chart.config.vertixes = vertixes
        if(width !== undefined) chart.config.width = width
        if(height !== undefined) chart.config.height = height
        if(bgColor !== undefined) chart.config.bgColor = bgColor
        if(vertixBuilders !== undefined) 
            chart.config.vertixBuilders = Object.assign(chart.config.vertixBuilders, vertixBuilders)
        if(vertixDrawers !== undefined) 
            chart.config.vertixDrawers = Object.assign(chart.config.vertixDrawers, vertixDrawers)
        if(vertixSourcesGetters !== undefined) 
            chart.config.vertixSourcesGetters = Object.assign(chart.config.vertixSourcesGetters, vertixSourcesGetters)
        if(edgeBuilders !== undefined) 
            chart.config.edgeBuilders = Object.assign(chart.config.edgeBuilders, edgeBuilders)
        if(edgeDrawers !== undefined) 
            chart.config.edgeDrawers = Object.assign(chart.config.edgeDrawers, edgeDrawers)
        if(svgDrawer !== undefined)
            chart.config.svgDrawer = svgDrawer
        if(isNodeSourceOfTarget !== undefined)
            chart.config.isNodeSourceOfTarget = Object.assign(chart.config.isNodeSourceOfTarget, isNodeSourceOfTarget)

        return chart
    }

    chart.data = ({nodes}: {nodes?: {[nodeType: string]: NodeType[]}} = {}) => {
        chart.state.vertixToNodeIndexMap = {}

        if(nodes !== undefined) chart.state.nodes = nodes

        for(let nodeType in chart.state.nodes) {
            chart.state.vertixToNodeIndexMap[nodeType] = {}

            chart.state.vertixes[nodeType] = chart.state.nodes[nodeType].map((node, i) => {
                chart.state.vertixToNodeIndexMap[nodeType][node.id] = i;

                return nodeToVerix(node)
            })
        }
        
        for(let nodeType in chart.state.nodes){
            chart.state.edges[nodeType] = {}

            chart.state.nodes[nodeType].forEach((node) => {
                const i = chart.state.vertixToNodeIndexMap[nodeType][node.id]
                const target = chart.state.vertixes[nodeType][i]

                const sourcesGetter = chart.config.vertixSourcesGetters[node.type]

                chart.state.edges[nodeType][node.id] = createEdgesToNode({
                    target, 
                    sources: sourcesGetter(
                        node, 
                        chart.getVertixOfNode
                    )
                })
            })
        }

        return chart
    }

    chart.draw = (parentSelection) => {
        chart.plot.parentSelection = parentSelection

        chart.plot.svg = chart.plot.parentSelection.selectAll('svg').data([1]).join('svg')
        chart.plot.svg.attr('style', 'user-select:none')
            .attr('width', chart.config.width)
            .attr('height', chart.config.height)

        chart.plot.bg = chart.plot.svg.selectAll('rect#bg').data([1]).join('rect')
            .attr('fill', chart.config.bgColor)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('id', 'bg')

        chart.plot.edges = chart.plot.svg.selectAll('g.edges').data([1]).join('g').attr('class', 'edges')
        chart.plot.vertixes = chart.plot.svg.selectAll('g.vertixes').data([1]).join('g').attr('class', "vertixes")

        chart.plot.edges.selectAll('g')
            .data(Object.keys(chart.state.edges))
            .join('g')
            .attr('class', nodeType => nodeType)

        for(let nodeType in chart.state.edges){
            const edges = chart.state.edges[nodeType]
            const selection = chart.plot.edges.select(`g.${nodeType}`)

            chart.config.edgeDrawers[nodeType](selection, edges, chart)
        }

        chart.plot.vertixes.selectAll('g')
            .data(Object.keys(chart.state.vertixes))
            .join('g')
            .attr('class', nodeType => nodeType)
        
        for(let nodeType in chart.state.vertixes){
            const vertixes = chart.state.vertixes[nodeType]
            const selection = chart.plot.vertixes.select(`g.${nodeType}`)

            chart.config.vertixDrawers[nodeType](selection, vertixes, chart)
        }

        chart.config.svgDrawer(chart)

        return chart
    }
    
    chart.selectNode = (node) => {
        if(node == null) return;
        if(chart.state.nodes[node.type].map(el => el.id).indexOf(node.id) < 0) return;

        const oldSelectedNode = chart.state.selectedNode
        chart.state.selectedNode = node

        if(oldSelectedNode != null && chart.state.nodes[oldSelectedNode.type].map(el => el.id).indexOf(oldSelectedNode.id) >= 0) {
            rebuildVertix(oldSelectedNode)
            rebuildEdgesOfNode(oldSelectedNode)
        }
        
        rebuildVertix(node)
        rebuildEdgesOfNode(node)

        return chart
    }

    chart.updateNode = (node, coord) => {
        if(!(node && node.type in vertixCoordinates && node.id in vertixCoordinates[node.type])) return;

        if(coord) vertixCoordinates[node.type][node.id] = coord

        rebuildVertix(node)
        rebuildEdgesOfNode(node)

        let vertSel = chart.plot.vertixes.select(`g.${node.type}`)
        let edgesSel = chart.plot.edges.select(`g.${node.type}`)
        let drawVertixes = chart.config.vertixDrawers[node.type]
        let drawEdges = chart.config.edgeDrawers[node.type]

        drawEdges(edgesSel, chart.state.edges[node.type], chart)
        drawVertixes(vertSel, chart.state.vertixes[node.type], chart)

        for(let nodeType in chart.state.nodes) {
            chart.state
                .nodes
                [nodeType]
                .filter(target => chart.config.isNodeSourceOfTarget[target.type](target, node))
                .forEach(target => {
                    rebuildEdgesOfNode(target)

                    let edgesSel = chart.plot.edges.select(`g.${target.type}`)
                    let drawEdges = chart.config.edgeDrawers[target.type]
                    let edges = chart.state.edges[target.type]

                    drawEdges(edgesSel, edges, chart)
                })
        }


        return chart
    }

    chart.getVertixOfNode = (node) => {
        if(!(node && 'type' in node && typeof node.id == 'number')) return null;
        if(!(node.type in chart.state.vertixToNodeIndexMap)) return null;
        if(!(node.id in chart.state.vertixToNodeIndexMap[node.type])) return null;
        
        const i = chart.state.vertixToNodeIndexMap[node.type][node.id]
        const vertix = chart.state.vertixes[node.type][i]

        return vertix
    }

    return chart
}