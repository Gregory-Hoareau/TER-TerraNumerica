import * as d3 from 'd3';
import { PawnState } from '../pawn-state';

export class PawnStateWaitingTurn implements PawnState {
    dragstarted(event: any, d: any) {
        if((d.role.includes('cops') && !d.gameM.thiefTurn) || (d.role.includes('thief') && d.gameM.thiefTurn)) {
            d3.select("#top-hud-turn-information-details")
                .append("p")
                    .attr("id", "warningNotYourTurn")
                    .text(() => "Ce pion a déjà bougé ce tour !")
        } else {
            d3.select("#top-hud-turn-information-details")
                .append("p")
                    .attr("id", "warningNotYourTurn")
                    .text(() => "Ce n'est pas votre tour !")
        }
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    }

    dragged(event: any, d: any) {
    }
    
    dragended(event: any, d: any): PawnState {
        d3.selectAll("#warningNotYourTurn").remove();
        return this;
    }
}
