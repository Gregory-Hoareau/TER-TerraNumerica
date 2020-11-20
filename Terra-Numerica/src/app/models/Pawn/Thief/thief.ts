import * as d3 from 'd3';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { Pawns } from '../pawn';

export class Thief extends Pawns {

    constructor(private gameM: GameService, private graphServ: GraphService, x: number, y: number){
        super(gameM, graphServ, x, y);
        this.role = "thief"
        d3.select("svg")
        .append('circle')
            .datum(this)
            .attr("class", "pawns "+ this.role)
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.radius)
            .attr("fill", "url(#pawnThiefImage)")
            .call(d3.drag()
                .on("start", this.dragstarted.bind(this))
                .on("drag", this.dragged.bind(this))
                .on("end", this.dragended.bind(this)));
    }
}