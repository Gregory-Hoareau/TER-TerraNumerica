import * as d3 from 'd3';
import { Pawns } from '../pawn';
import { GraphService } from 'src/app/_services/graph/graph.service';

export class Cops extends Pawns {
    role: any;

    constructor(private graphServ: GraphService, x: number, y: number){
        super(graphServ, x, y);
        d3.select("svg")
        .append('circle')
            .datum(function(){ return this; })
            .attr("class", "pawns")
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.radius)
            .attr("fill", "rgb(0,0,255)")
            .call(d3.drag()
                .on("start", this.dragstarted.bind(this))
                .on("drag", this.dragged)
                .on("end", this.dragended.bind(this)));
      }
}