import { SimulationNodeDatum } from 'd3';

export abstract class Graph {
    private _typology: string;
    private _nodes;
    private _links;
    private _svgNodes;
    private _svgLinks;

    constructor(nodes, links, typology: string) {
        this._nodes = [...nodes];
        this._links = [...links];   
        this._typology = typology;
    }

    /* ---------- GRAPH DRAWING ---------- */

    draw(svg: any) {

        this.svgLinks = svg.selectAll("line")
            .data(this.links)
            .join("line")
                .style("stroke", "#aaa")

        this.svgNodes = svg.selectAll("circle")
            .data(this.nodes)
            .join("circle")
                .attr("r", 20)
                .attr("class", "circle")
                .style("fill", "#69b3a2")
        
        this.simulate(svg);

    }

    abstract simulate(svg: any);

    abstract ticked();

    /* ---------- GRAPH COMPUTATIONS ---------- */

    edges(node): SimulationNodeDatum[] {
        const edges = [];
        for(const l of this.links) {
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

    /* ---------- PROPERTIES ---------- */

    // GETTERS

    get nodes() {
        return this._nodes
    }

    get links() {
        return this._links
    }

    get typology(): string {
        return this._typology
    }

    get svgNodes() {
        return this._svgNodes
    }

    get svgLinks() {
        return this._svgLinks
    }

    // SETTERS

    set nodes(n) {
        this._nodes = n;
    }

    set links(l) {
        this._links = l;
    }

    set typology(type: string) {
        this._typology = type;
    }

    set svgNodes(nodes) {
        this._svgNodes = nodes
    }

    set svgLinks(links) {
        this._svgLinks = links
    }

    /* -------------------------------- */
}
