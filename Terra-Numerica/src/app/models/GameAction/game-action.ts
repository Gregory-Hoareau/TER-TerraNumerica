import * as d3 from 'd3';
import { environment } from 'src/environments/environment';
import { Pawns } from '../Pawn/pawn';

export class GameAction {
    private pawn: Pawns;
    private startPosition;
    private endPosition;

    constructor(pawn, strat, end) {
        this.pawn = pawn;
        this.startPosition = strat;
        this.endPosition = end;
    }

    cancelAction() {
        d3.select('.'+this.pawn.role)
            .attr("cx", this.pawn.x = this.startPosition.x)
            .attr("cy", this.pawn.y = this.startPosition.y)
        this.pawn.state = environment.onTurnState
    }


}
