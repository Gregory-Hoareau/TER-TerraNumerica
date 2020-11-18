import { SimulationNodeDatum } from 'd3';

export class Graph {
    private _nodes;
    private _links; 

    constructor(nodes, links) {
        this._nodes = nodes;
        this._links = links;
    }

    edges(node): SimulationNodeDatum[] {
        const edges = [];
        for(const l of this._links) {
            if(l.source.index === node.index) {
                edges.push(this._nodes.find(n => n.index === l.target.index))
            } else if (l.target.index === node.index) {
                edges.push(this._nodes.find(n => n.index === l.source.index))
            }
        }
        return edges;
    }

    distance(n1, n2) {
        let distance = 0;
        let marked = [];
        marked.push(n1.index);
        if(n1.index===n2.index) {
            return distance;
        }

        
        let edges = this.edges(n1).filter(e => !(e.index in marked));
        
        while(edges.length > 0) {
            distance++;
            for(const e of edges) {
                if(e.index===n2.index) return distance;
            }
            const save =  edges;
            edges = []
            for(const e of save) {
                //console.log(this.edges(e).filter(i => !(i.id in marked)))
                const temp = this.edges(e).filter(i => !(i.index in marked)).forEach(edge => {
                    let isIn = false
                    for(const i of edges) {
                        if(i.index === edge.index) {
                            isIn = true;
                            break;
                        }
                    }
                    if(!isIn) edges.push(edge)
                })
                marked.push(e.index);
            }
        }
        return -1;
    }

    get nodes() {
        return this._nodes
    }

    get links() {
        return this._links
    }

    set nodes(n) {
        this._nodes = n;
    }

    set links(l) {
        this._links = l;
    }
}