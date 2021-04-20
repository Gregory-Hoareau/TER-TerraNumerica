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
    /**
     * Function who populate an html svg canvas with circles and lines to represent a graph
     * @param svg d3 selection of an html svg
     */
    draw(svg: any) {
        /* console.log('LINKS', this.links)
        console.log('NODES', this.nodes) */

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

    /**
     * Function to generate de the D3 network datum for the good use of the graph
     * @param svg d3 selection of an html svg
     */
    abstract simulate(svg: any): void;

    /**
     * Function needed by the force simulation of D3.js library
     */
    abstract ticked(): void;

    /* ---------- GRAPH COMPUTATIONS ---------- */

    getRandomEdge(): SimulationNodeDatum {
        return {...this._nodes[this.getRandomInt(this._nodes.length-1)]};
    }

    /**
     * Tool function to compute the edges of a node for a graph
     * @param {any} node - from where you need to computes edges
     * @returns {SimulationNodeDatum[]} list of edges of the node param
     */
    edges(node, speed = 1, exclude= []): SimulationNodeDatum[] {
        const edges = [];
        for(const l of this.links) {
            if(l.source.index === node.index) {
                edges.push(this._nodes.find(n => n.index === l.target.index))
            } else if (l.target.index === node.index) {
                edges.push(this._nodes.find(n => n.index === l.source.index))
            } else if (l.source === node.index) {
                edges.push(this._nodes.find(n => n.index === l.target))
            } else if (l.target === node.index) {
                edges.push(this._nodes.find(n => n.index === l.source))
            }
        }
        if(speed > 1) {
            return this.globalEdges(edges, --speed, exclude)
        }
        return edges;
    }

    private globalEdges(edges, speed, exclude = []) {
        let result: any[] = edges;
        let new_edges = [...edges];
        while(speed !== 0) {
            /* console.log('EXCLUDING EDGES', exclude)
            console.log('NEW EDGES', new_edges) */
            const tmp = [];
            for(const e of new_edges) {
                //console.log('THERE', exclude.includes(e))
                if(!exclude.includes(e)) {
                    this.edges(e).forEach(n => {
                        /* console.log('FIND', exclude.some(el => el.index === n.index)) */
                        if(!result.find(el => el.index === n.index) && !exclude.some(el => el.index === n.index)) {
                            result.push(n);
                            tmp.push(n)
                        } 
                    })
                }
            }
            new_edges = tmp;
            speed--;
        }
        return result;
    }

    /**
     * Function to get a random edge of a node of a graph
     * @param n node from where you need to get a random edge
     * @returns a random edge of the input node
     */
    getRandomAccessibleEdges(n, speed) {
        const edges = this.edges(n, speed);
        return edges[this.getRandomInt(edges.length)];
    }

    distance(n1, n2) {
        let distance = 0;
        let marked = [];
        marked.push(n1.index);
        if(n1.index===n2.index) {
            return distance;
        }

        
        let edges = this.edges(n1).filter(e => !(marked.includes(e.index)));
        
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
    private getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
