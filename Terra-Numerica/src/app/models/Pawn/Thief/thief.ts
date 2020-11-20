import * as d3 from 'd3';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { Pawns } from '../pawn';

export class Thief extends Pawns {

    constructor(private graphServ: GraphService, x: number, y: number){
        super(graphServ, x, y);
        this.role = "thief"
        d3.select("svg")
        .append('circle')
            .datum(this)
            .attr("class", "pawns "+ this.role)
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.radius)
            .attr("fill", "rgb(0,255,0)")
            .call(d3.drag()
                .on("start", this.dragstarted.bind(this))
                .on("drag", this.dragged.bind(this))
                .on("end", this.dragended.bind(this)));
    }
}