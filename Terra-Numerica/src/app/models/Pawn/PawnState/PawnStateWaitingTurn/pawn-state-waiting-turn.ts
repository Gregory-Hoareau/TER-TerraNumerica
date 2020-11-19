import * as d3 from 'd3';
import { PawnState } from '../pawn-state';

export class PawnStateWaitingTurn implements PawnState {
    dragstarted(event: any, d: any) {
        d3.select("svg")
            .append("text")
                .attr("id", "warningNotYourTurn")
                .attr("x", 500)
                .attr("y", 100)
                .attr("width", 200)
                .text( function (d) { return "Ce n'est pas votre tour !"; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "30px")
                .attr("fill", "red");        
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event: any, d: any) {
    }
    dragended(event: any, d: any): PawnState {
        d3.selectAll("#warningNotYourTurn").remove();
        return this;
    }
}
