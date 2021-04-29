import { Graph } from "../graph";
import * as d3 from 'd3';

export class Specific extends Graph {

    private config;

    constructor(nodes, links) {
        super(nodes, links, 'specific');
        this.config = localStorage.getItem('config');
    }

    draw(svg) {
        this.config = JSON.parse(this.config)
        const save_node = this.config.nodes;
        const save_link = this.config.links;

        this.svgLinks = svg.selectAll('links')
            .data(this.links)
            .join('line')
                .attr('x1', d => save_node[d.source].x)
                .attr('y1', d => save_node[d.source].y)
                .attr('x2', d => save_node[d.target].x)
                .attr('y2', d => save_node[d.target].y)
                .style('stroke', 'rgb(170, 170, 170)')

        this.svgNodes = svg.selectAll("nodes")
            .data(this.nodes)
            .join("circle")
                .attr("r", 20)
                .attr("class", "circle")
                .style("fill", "#69b3a2")
                .attr('cx', (d) => d.x)
                .attr('cy', (d) => d.y)

        this.simulate(svg)
    }

    simulate(svg) {
        this.simulation = d3.forceSimulation(this.nodes)
            /* .force("link", d3.forceLink()
                .links(this.links)
            ) */
            .on("end", this.ticked.bind(this));
    }

    stop() {
        
    }

    ticked() {
        const save_node = this.config.nodes;
        this.svgLinks
            .attr("x1", function(d) { return save_node[d.source].x; })
            .attr("y1", function(d) { return save_node[d.source].y; })
            .attr("x2", function(d) { return save_node[d.target].x; })
            .attr("y2", function(d) { return save_node[d.target].y; });

        this.svgNodes
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

    }
}
