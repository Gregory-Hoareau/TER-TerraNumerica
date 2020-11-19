import { Pawns } from './Pawn';
import { GraphService } from '../_services/graph/graph.service';
import * as d3 from 'd3';

export class Cops extends Pawns{

    constructor(private graphServ: GraphService, x: number, y: number){
        super(graphServ, x, y);
        d3.select("svg")
        .append('circle')
        //.data(this)
        //.join("circle")
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