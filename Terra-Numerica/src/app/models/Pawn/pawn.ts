import * as d3 from 'd3';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { environment } from 'src/environments/environment';
import { PawnState } from './PawnState/pawn-state';
import { PawnStateOnTurn } from './PawnState/PawnStateOnTurn/pawn-state-on-turn';
import { PawnStateWaitingPlacement } from './PawnState/PawnStateWaitingPlacement/pawn-state-waiting-placement';
import { PawnStateWaitingTurn } from './PawnState/PawnStateWaitingTurn/pawn-state-waiting-turn';

export class Pawns {

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

}