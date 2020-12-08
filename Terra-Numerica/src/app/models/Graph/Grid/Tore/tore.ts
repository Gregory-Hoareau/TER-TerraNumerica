import * as d3 from 'd3';
import { Graph } from '../../graph';

export class Tore extends Graph {

    private grid_width: number;
    private grid_height: number;
    private grid = {
        cells: [],
        init: function(tab_width, tab_height, canvas_width, canvas_height) {
            this.cells = [];
            for (let row = 0 ; row < tab_height ; ++row) {
                const y = row * canvas_height/tab_height + (canvas_height/tab_height)/2;
                for (let col = 0 ; col < tab_width ; ++col) {
                    const x = col * canvas_width/tab_width + (canvas_width/tab_width)/2;
                    this.cells.push({
                        id: row*tab_width+col,
                        x: x,
                        y: y,
                        occupied: false
                    })
                }
            }
        },
    
        sqdist: function (a, b) {
          return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
        },
    
        getCell: function (d) {
          return this.cells[d.index];
        }
    }

    constructor(nodes, links, width: number, height: number) {
        super(nodes, links, "tore");
        this.grid_width = width;
        this.grid_height = height;
    }

    draw(svg: any) {

        const canvas_width = parseInt(svg.style("width"), 10);
        const canvas_height = parseInt(svg.style("height"), 10);

        this.grid.init(this.grid_width, this.grid_height, canvas_width, canvas_height);
        for (let row = 0 ; row < this.grid_height ; ++row) {
            const y = row * canvas_height/this.grid_height + (canvas_height/this.grid_height)/2;
            const margin = ((canvas_width/this.grid_width)/2)/2
            const x1 = (canvas_width/this.grid_width)/2 - margin;
            const x2 = canvas_width - (canvas_width/this.grid_width)/2 + margin;
            svg.append('line')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', canvas_width)
                .attr('y2', y)
                .style('stroke', 'rgb(170, 170, 170)')
                .style('stroke-dasharray', '4, 10');
            svg.append('line')
                .attr('x1', x1)
                .attr('y1', y)
                .attr('x2', x2)
                .attr('y2', y)
                .style('stroke', 'rgb(170, 170, 170)');
        }
        for (let col = 0 ; col < this.grid_width ; ++col) {
            const x = col * canvas_width/this.grid_width + (canvas_width/this.grid_width)/2;
            const margin = ((canvas_height/this.grid_height)/2)/2
            const y1 = (canvas_height/this.grid_height)/2 - margin;
            const y2 = canvas_height - (canvas_height/this.grid_height)/2 + margin;
            svg.append('line')
                .attr('x1', x)
                .attr('y1', y1)
                .attr('x2', x)
                .attr('y2', y2)
                .style('stroke', 'rgb(170, 170, 170)')
            svg.append('line')
                .attr('x1', x)
                .attr('y1', 0)
                .attr('x2', x)
                .attr('y2', canvas_height)
                .style('stroke', 'rgb(170, 170, 170)')
                .style('stroke-dasharray', '4, 10');
        }

        this.svgLinks = svg.selectAll("links")
            .data(this.links)
            .join("line")

        this.svgNodes = svg.selectAll("nodes")
            .data(this.nodes)
            .join("circle")
                .attr("r", 20)
                .attr("class", "circle")
                .style("fill", "#69b3a2")
        
        this.simulate(svg);

    }

    simulate(svg: any) {
        d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink()
                .links(this.links)
            )
            .on("tick", this.ticked.bind(this));
    }

    ticked() {
        this.svgLinks
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        this.svgNodes
            .each( (d) => {
                let gridpoint = this.grid.getCell(d);
                if (gridpoint) {
                d.x += (gridpoint.x - d.x);
                d.y += (gridpoint.y - d.y);
                }
            })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }
}
