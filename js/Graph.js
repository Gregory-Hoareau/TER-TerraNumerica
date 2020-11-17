export class Graph {


    constructor(nodes, links) {
        this.nodes = nodes;
        this.links = links;
    }

    edges(node) {
        const edges = [];
        for(const l of this.links) {
            if(l.source.id === node.id) {
                edges.push(this.nodes.find(n => n.id === l.target.id))
            } else if (l.target.id === node.id) {
                edges.push(this.nodes.find(n => n.id === l.source.id))
            }
        }
        return edges;
    }
}