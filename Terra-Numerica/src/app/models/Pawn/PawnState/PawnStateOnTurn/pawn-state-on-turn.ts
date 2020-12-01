import * as d3 from 'd3';
import { GameAction } from 'src/app/models/GameAction/game-action';
import { GameService } from 'src/app/_services/game/game.service';
import { environment } from 'src/environments/environment';
import { PawnState } from '../pawn-state';

export class PawnStateOnTurn implements PawnState {
    edges: any = null;
    dragstarted(event: any, d: any) {
        d.lastPosX = event.x
        d.lastPosY = event.y
        d.settedPosition = false;
        this.edges = d.graphService.showPossibleMove(d.lastSlot)
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event: any, d: any) {
        d3.select("."+d.role).attr("cx", event.x).attr("cy", event.y);
        if(d.graphService.gameMode == "facile"){
            let edges = this.edges
            d3.selectAll(".circle")
                .filter(function(nodeData:any){
                    return edges.includes(nodeData);
                })
                .each((nodeData:any, id:any, elements:any) => {
                    let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
                    let distance = d.detectRadius;
                    if (h <= distance) {
                        d.graphService.showPossibleMove(elements[id]);
                    }
                })
        }
    }
    dragended(event: any, d: any, gameManager: GameService): PawnState {
        d3.select(event.sourceEvent.target).attr("stroke", null);
        let position = {
            x: d.lastPosX,
            y: d.lastPosY,
        }

        let edges = this.edges

        const startPosition = {
            x: d.lastPosX,
            y: d.lastPosY
        }
        const previousSlot = d.lastSlot;
        let distance = d.detectRadius;
        let node;
        d3.selectAll(".circle")
            .filter(function(nodeData:any){
                return edges.includes(nodeData);
            })
            .each((nodeData:any, id:any, elements:any) => {
                let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
                if (h <= distance) {
                    node = nodeData;
                    distance = h;
                    position.x = nodeData.x;
                    position.y = nodeData.y;
                    d.settedPosition = true;
                    d.possiblePoints = d.graphService.showPossibleMove(elements[id]);
                    d.lastSlot = elements[id]
                }
            })
        
        if(startPosition.x !== position.x || startPosition.y !== position.y) {
            gameManager.addGameAction(new GameAction(d, startPosition, {x: position.x, y: position.y}, previousSlot))
        } else {
            d.settedPosition = false;
        }
        d3.select("."+d.role).attr("cx", d.x = position.x).attr("cy", d.y = position.y);
        d.updatePosition(node);

        if (!d.settedPosition) {
            return this;
        } else {
            return environment.waitingTurnState; 
        }
    }
}
