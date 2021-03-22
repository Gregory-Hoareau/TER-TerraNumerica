import * as d3 from 'd3';
import { Graph } from '../graph';

export class Tree extends Graph {
    constructor(nodes, links) {
        super(nodes, links, "tree");
    }

    /**
     * Initialise the d3 force simulation to work with a network
     * @param svg d3 selection of an html svg
     */
    simulate(svg: any) {
        const width = parseInt(svg.style("width"), 10);
        const height = parseInt(svg.style("height"), 10);
        d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink()
                .links(this.links)
            )
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("charge", d3.forceManyBody().strength(-500))
            .on("tick", this.ticked.bind(this));
    }
    
    /**
     * Function needed for the placement of the nodes and links in the d3 force simulation
     */
    ticked() {
        this.svgLinks
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        this.svgNodes
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }
}
