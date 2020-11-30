import * as d3 from 'd3';
import { Graph } from '../graph';

export class Grid extends Graph {

    private long: number;
    private lar: number;
    private grid = {
        cells: [],
        GRID_SIZE: 100,
        init: function(lar, long, width, height) {
            this.cells = [];
            var id = 0;
            for(var i = 0 ; i < long ; ++i) {
                for(var j = 0 ; j < lar ; ++j) {
                this.cells.push({
                    id: id,
                    x: i * width/long + (width/long)/2,
                    y: j * height/lar + (height/lar)/2,
                    occupied: false
                });
                id++;
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

    constructor(nodes, links, long: number, lar: number) {
        super(nodes, links, "grid");
        this.long = long;
        this.lar = lar;
    }

    simulate(svg: any) {
        const width = parseInt(svg.style("width"), 10);
        const height = parseInt(svg.style("height"), 10);
        this.grid.init(this.lar, this.long, width, height);
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