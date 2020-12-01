import * as d3 from 'd3';
import { Pawns } from '../pawn';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { GameService } from 'src/app/_services/game/game.service';
import { TrackingStrategy } from '../../Strategy/Cop/TrackingStrategy/tracking-strategy';
import { WatchingStrategy } from '../../Strategy/Cop/WatchingStrategy/watching-strategy';
import { GridStrategy } from '../../Strategy/Cop/GridStrategy/grid-strategy';

export class Cops extends Pawns {

    constructor(private gameM: GameService, private graphServ: GraphService, x: number, y: number, id: number){
        super(gameM, graphServ, x, y);
        this.role = "cops"+id
        this.strategy = new GridStrategy(graphServ);
        d3.select("svg")
        .append('circle')
            .datum(this)
            .attr("class", "pawns "+ this.role)
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.radius)
            .style("fill", "url(#pawnCopsImage)")
            .call(d3.drag()
                .on("start", this.dragstarted.bind(this))
                .on("drag", this.dragged.bind(this))
                .on("end", this.dragended.bind(this)));
      }

      updatePosition(node) {
          if(node) this.gameM.updateCopsPosition(this, node);
      }
}