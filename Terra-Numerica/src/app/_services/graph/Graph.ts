import { SimulationNodeDatum } from 'd3';

export class Graph {
    private _nodes;
    private _links; 

    constructor(nodes, links) {
        this._nodes = nodes;
        this._links = links;
    }

    getRandomEdge(): SimulationNodeDatum {
        return Object.assign({}, this._nodes[this.getRandomInt(this._nodes.length-1)]);
    }

    edges(node): SimulationNodeDatum[] {
        const edges = [];
        edges.push(this._nodes.find(n => n.index === node.index))
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
                if(e.index == n2.index) return distance;
            }
            const save =  edges;
            edges = []
            for(const e of save) {
                const temp = this.edges(e).filter(i => !(marked.includes(i.index))).forEach(edge => {
                    let isIn = false
                    for(const i of edges) {
                        if(i.index === edge.index) {
                            isIn = true;
                        }
                    }
                    if(!isIn) edges.push(edge)
                })
                marked.push(e.index);
            }
        }
        return -1;
    }

    getRandomAccessibleEdges(n) {
        const edges = this.edges(n);
        return edges[this.getRandomInt(edges.length)];
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

    private getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}