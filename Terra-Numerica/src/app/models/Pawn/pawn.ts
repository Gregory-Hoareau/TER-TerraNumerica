import * as d3 from 'd3';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { PawnState } from './PawnState/pawn-state';
import { PawnStateWaitingPlacement } from './PawnState/PawnStateWaitingPlacement/pawn-state-waiting-placement';

export class Pawns {

    state: PawnState;
    role: string;
    x: number;
    y: number;
    firstMove: boolean;
    possiblePoints: any;
    lastSlot: any;
    yourTurn: boolean;
    radius = 20;
    detectRadius = 25;
    lastPosX;
    lastPosY;
    settedPosition = true;

    constructor(private graphService: GraphService, x: number, y: number){
        this.x = x;
        this.y = y;
        this.firstMove = true;
        this.possiblePoints = [];
        this.lastSlot = [];
        this.yourTurn = true;

        this.state = new PawnStateWaitingPlacement();
    }

    dragstarted(event, d) {

        this.state.dragstarted(event, d);

    }

    dragged(event, d) {

        this.state.dragged(event, d);

        // d3.select(this as any).attr("cx", event.x).attr("cy", event.y);
    }

    dragended(event, d) {

        this.state = this.state.dragended(event, d);

    }

}