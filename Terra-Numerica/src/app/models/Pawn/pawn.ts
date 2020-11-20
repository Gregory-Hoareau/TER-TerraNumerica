import * as d3 from 'd3';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { environment } from 'src/environments/environment';
import { PawnState } from './PawnState/pawn-state';

export class Pawns {

    role: string;
    x: number;
    y: number;
    firstMove: boolean;
    possiblePoints: any;
    lastSlot: any;
    yourTurn: boolean;
    radius = 40;
    detectRadius = 45;
    lastPosX;
    lastPosY;
    settedPosition = true;

    state: PawnState;
    constructor(private gameManager: GameService,private graphService: GraphService, x: number, y: number){
        this.x = x;
        this.y = y;
        this.firstMove = true;
        this.possiblePoints = [];
        this.lastSlot = [];
        this.yourTurn = true;

        this.state = environment.waitingPlacementState;
    }

    dragstarted(event, d) {
        this.state.dragstarted(event, d);
    }

    dragged(event, d) {
        this.state.dragged(event, d);
    }

    dragended(event, d) {
        this.state = this.state.dragended(event, d);
        this.gameManager.update();
    }

    isWaitingPlacement() {
        return this.state === environment.waitingPlacementState;
    }

    onTurn() {
        return this.state === environment.onTurnState;
    }

    isAtSamePostionAs(pawn: Pawns) {
        return this.x === pawn.x && this.y === pawn.y
    }

}