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

    /**
     * Abstract Pawn object
     * @param gameManager 
     * @param graphService 
     * @param {number} x - X position of the pawn when drawed for the first time on a canvas
     * @param {number} y - Y position of the pawn when drawed for the first time on a canvas
     */
    constructor(public gameManager: GameService, public graphService: GraphService, x: number, y: number){
        this.x = x;
        this.y = y;
        this.firstMove = true;
        this.possiblePoints = [];
        this.lastSlot = [];
        this.yourTurn = true;

        // Default state of a pawn : waiting placement on the game board
        this.state = environment.waitingPlacementState;
    }

    /**
     * Function to set the strategy of a pawn
     * @param {IStrategy} strat - the next strategy of the pawn
     */
    setStrategy(strat: IStrategy) {
        this.strategy = strat;
    }

    /**
     * TODO
     * @param graph 
     * @param cops 
     * @param thiefs 
     */
    place(graph, cops = [], thiefs = []) {
        //console.log('PLACING')
        const pos = this.strategy.placement(graph, cops, thiefs);
        this.updatePosition(pos);
        d3.select('.'+this.role)
            .attr("cx", this.x = pos.x)
            .attr("cy", this.y = pos.y)
            .raise();
        this.lastSlot = pos;
        this.settedPosition = true;
        this.firstMove = false;
        this.state = environment.waitingTurnState;
    }

    /**
     * TODO
     * @param graph 
     * @param cops 
     * @param thiefs 
     */
    move(graph, cops = [], thiefs = []) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.moveCallback(graph, cops, thiefs)
                resolve(true);
            }, 2000)
        })
    }

    protected moveCallback(graph, cops, thiefs) {
        const speed = this.role.includes('thief') ? this.gameManager.getThiefSpeed() : 1;
        const pos = this.strategy.move(graph, cops, thiefs, speed);
        this.updatePosition(pos);
        console.log('THIS', this);
        console.log('POS', pos)
        d3.select('.'+this.role)
            .attr("cx", this.x = pos.x)
            .attr("cy", this.y = pos.y)
            .raise();
        this.lastSlot = pos;
        this.settedPosition = true;
        this.firstMove = false;
        this.state = environment.waitingTurnState;
    }

    /**
     * Event handled on start of the drag of the pawn
     * @param event d3 drag event
     * @param d data associated to the svg element dragged, it the pawn object itself
     */
    dragstarted(event, d) {
        this.state.dragstarted(event, d);
    }

    /**
     * Event handled during the drag of the pawn
     * @param event d3 drag event
     * @param d data associated to the svg element dragged, it the pawn object itself
     */
    dragged(event, d) {
        this.state.dragged(event, d);
    }

    /**
     * Event handled at the end of the the drag of the pawn
     * @param event d3 drag event
     * @param d data associated to the svg element dragged, it the pawn object itself
     */
    dragended(event, d) {
        this.state = this.state.dragended(event, d, this.gameManager);
        this.gameManager.update();
    }

    /**
     * Function to check if the pawn state is on WaitingPlacement
     */
    isWaitingPlacement() {
        return this.state === environment.waitingPlacementState;
    }

    /**
     * Function to check if the pawn state is on WaitingTurn
     */
    hasPlayed() {
        return this.state === environment.waitingTurnState;
    }

    /**
     * Function to check if the pawn state is on his turn
     */
    onTurn() {
        return this.state === environment.onTurnState;
    }

    /**
     * Function to check if the pawn is at the same position of another pawn
     * @param {Pawn} pawn - Pawn which we want to check if the pawn is at same position
     */
    isAtSamePostionAs(pawn: Pawns) {
        return pawn.x - 5 < this.x && this.x < pawn.x + 5 && pawn.y - 5 < this.y && this.y < pawn.y + 5
    }

    /**
     * Function used to notify the game service of the new position of pawn
     * @param node - new position on a graph of the pawn
     */
    abstract updatePosition(node)

}