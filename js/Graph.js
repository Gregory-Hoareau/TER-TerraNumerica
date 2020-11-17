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

    distance(n1, n2) {
        let distance = 0;
        let marked = [];
        marked.push(n1.id);
        if(n1.id===n2.id) {
            return distance;
        }

        
        let edges = this.edges(n1).filter(e => !(e.id in marked));
        
        while(edges.length > 0) {
            distance++;
            for(const e of edges) {
                if(e.id===n2.id) return distance;
            }
            const save =  edges;
            edges = []
            for(const e of save) {
                //console.log(this.edges(e).filter(i => !(i.id in marked)))
                const temp = this.edges(e).filter(i => !(i.id in marked)).forEach(edge => {
                    let isIn = false
                    for(const i of edges) {
                        if(i.id === edge.id) {
                            isIn = true;
                            break;
                        }
                    }
                    if(!isIn) edges.push(edge)
                })
                marked.push(e.id);
            }
        }
        return -1;
    }
}