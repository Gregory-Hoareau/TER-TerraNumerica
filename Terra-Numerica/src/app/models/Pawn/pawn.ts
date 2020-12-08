import * as d3 from 'd3';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { environment } from 'src/environments/environment';
import { IStrategy } from '../Strategy/istrategy';
import { PawnState } from './PawnState/pawn-state';

export abstract class Pawns {

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
    strategy: IStrategy;

    state: PawnState;
    constructor(private gameManager: GameService, public graphService: GraphService, x: number, y: number){
        this.x = x;
        this.y = y;
        this.firstMove = true;
        this.possiblePoints = [];
        this.lastSlot = [];
        this.yourTurn = true;

        this.state = environment.waitingPlacementState;
    }

    setStrategy(strat) {
        this.strategy = strat;
    }

    place(graph, cops = [], thiefs = []) {
        const pos = this.strategy.placement(graph, cops, thiefs);
        this.updatePosition(pos);
        d3.select('.'+this.role)
            .attr("cx", this.x = pos.x)
            .attr("cy", this.y = pos.y);
        this.settedPosition = true;
        this.firstMove = false;
        this.state = environment.waitingTurnState;
    }

    move(graph, cops = [], thiefs = []) {
        const pos = this.strategy.move(graph, cops, thiefs);
        this.updatePosition(pos);
        d3.select('.'+this.role)
            .attr("cx", this.x = pos.x)
            .attr("cy", this.y = pos.y);
        this.lastSlot = pos;
        this.settedPosition = true;
        this.firstMove = false;
        this.state = environment.waitingTurnState;
    }

    dragstarted(event, d) {
        this.state.dragstarted(event, d);
    }

    dragged(event, d) {
        this.state.dragged(event, d);
    }

    dragended(event, d) {
        this.state = this.state.dragended(event, d, this.gameManager);
        this.gameManager.update();
    }

    isWaitingPlacement() {
        return this.state === environment.waitingPlacementState;
    }

    onTurn() {
        return this.state === environment.onTurnState;
    }

    isAtSamePostionAs(pawn: Pawns) {
        return pawn.x - 5 < this.x && this.x < pawn.x + 5 && pawn.y - 5 < this.y && this.y < pawn.y + 5
    }

    abstract updatePosition(node)

}