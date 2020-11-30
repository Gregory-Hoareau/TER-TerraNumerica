import * as d3 from 'd3';
import { Graph } from '../graph';

export class Cycle extends Graph {
    constructor(nodes, links) {
        super(nodes, links, "cycle");
    }

    simulate(svg: any) {
        const width = parseInt(svg.style("width"), 10);
        const height = parseInt(svg.style("height"), 10);
        const poolRadius = () => {
            if (width < height) {
                return (width/2)-50;
            } else {
                return (height/2)-50;
            }
        }
        d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink()
                .links(this.links)
            )
            .force("radial", d3.forceRadial(poolRadius(), width / 2, height / 2))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", this.ticked.bind(this));
    }
    
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
