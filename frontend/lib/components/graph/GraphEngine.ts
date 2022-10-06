import { EdgeType, VertixType } from "../../../components/graph/GraphView";
import { RecordsType, RecordType } from "../../../store/recordsSlice";


type marginsType = {
    top: number,            // px
    left: number,      
    right: number, 
    bottom: number
}

type drawConf = {
    margins: marginsType
}

type getNodeSources = {
    [nodeType: string]: (node: RecordType) => {type: string, id: string}[]
}

// vertix is information which represents point on svg
// node is information from record which is represented as vertix 

// viewbox is 16x9
export function GraphEngine(c: drawConf, getNodeSources: getNodeSources) {
    let width = 1920; 
    let height = 1080;

    this.records = {} as RecordsType       // the same as nodes in graph

    this.vertixes = {} as {[nodeType: string]: {[nodeId: string]: VertixType}}
    this.edges  = {} as {[nodeType: string]: EdgeType[]}


    this.redraw = function(){
        const newEdges = {}
        const newVertixes = {}
        const newEdgePointers = {}

        for(let type in this.records) {
            newEdges[type] = []
            newVertixes[type] = {}
            newEdgePointers[type] = []

            for(let i in this.records[type]) {
                const rec = this.records[type][i]

                // vertix 
                const x = c.margins.left + Math.random() * (width - c.margins.left - c.margins.right);
                const y = c.margins.top + Math.random() * (height - c.margins.top - c.margins.bottom);
                const vertix = {
                    x, 
                    y,
                    r: 25,
                    node: rec
                }

                if(this.vertixes[type] && this.vertixes[type][rec.id] != null) {
                    const v = this.vertixes[type][rec.id]
                    vertix.x = v.x
                    vertix.y = v.y
                }

                newVertixes[type][rec.id] = vertix

                // Edges to current vertix
                const targetSources = getNodeSources[type](rec).filter(({type, id}) => {
                    return this.records[type] && this.records[type].find(rec => rec.id == id)
                })

                const target = { type, id: rec.id }

                newEdges[type].push(...targetSources.map((source) => ({source, target})))
            }
        }

        this.vertixes = newVertixes
        this.edges = newEdges
    }

    this.setRecords = function(newRecords) {
        this.records = newRecords
    }

    this.updateVertix = function(type, node, x, y) {
        if(!this.vertixes[type]) {
            return;
        }

        for(let i in this.vertixes[type]) {
            if(this.vertixes[type][i].node.id == node.id) {
                this.vertixes[type][i].x = x
                this.vertixes[type][i].y = y
                break;
            }
        }
    }


    this.getVertixes = function() {
        return JSON.parse(JSON.stringify(this.vertixes))
    }

    this.getEdges = function() {
        return JSON.parse(JSON.stringify(this.edges))
    }
}