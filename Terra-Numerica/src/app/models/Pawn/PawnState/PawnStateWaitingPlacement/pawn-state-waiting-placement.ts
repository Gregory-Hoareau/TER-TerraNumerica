import * as d3 from 'd3';
import { environment } from 'src/environments/environment';
import { PawnState } from '../pawn-state';
import { PawnStateOnTurn } from '../PawnStateOnTurn/pawn-state-on-turn';
import { PawnStateWaitingTurn } from '../PawnStateWaitingTurn/pawn-state-waiting-turn';

export class PawnStateWaitingPlacement implements PawnState {

    //nextState: PawnState = environment.waitingTurnState //new PawnStateWaitingTurn();

    dragstarted(event: any, d: any) {
        d.lastPosX = event.x
        d.lastPosY = event.y
        d.settedPosition = false;
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event: any, d: any) {
        d3.select("."+d.role).attr("cx", event.x).attr("cy", event.y);
    }
    dragended(event: any, d: any): PawnState {

        d3.select(event.sourceEvent.target).attr("stroke", null);
        
        let position = {
            x: d.lastPosX,
            y: d.lastPosY,
        }

        let distance = d.detectRadius;
        d3.selectAll(".circle").each((nodeData:any, id:any, elements:any) => {
            let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
            if (h <= distance) {
                distance = h;
                position.x = nodeData.x;
                position.y = nodeData.y;
                d.settedPosition = true;
                d.possiblePoints = d.graphService.showPossibleMove(elements[id]);
                d.lastSlot = elements[id]
            }
        })

        d3.select("."+d.role).attr("cx", d.x = position.x).attr("cy", d.y = position.y);

        if (!d.settedPosition) {
            return this;
        } else {
            return environment.waitingTurnState; 
        }

        // d3.select
        // d3.select(this as any).attr("cx", d.x = d.lastPosX).attr("cy", d.y = d.lastPosY);

        // ANTHONY CODE
        // let circles = document.getElementsByClassName("circle");
        // for (let i = 0; i<circles.length; i++ ) {
        //     let c = circles[i] as any;
        //     console.log(c)
        //     console.log(d)
        //     console.log(event)
        //     if (c.cx.baseVal.value - d.detectRadius <= event.x && event.x <= c.cx.baseVal.value + d.detectRadius) {
        //         if (c.cy.baseVal.value - d.detectRadius <= event.y && event.y <= c.cy.baseVal.value + d.detectRadius) {
        //             d.possiblePoints = d.graphService.showPossibleMove(c)
        //             d.lastSlot = c;
        //             d3.select(event.sourceEvent.target).attr("cx", d.x = c.cx.baseVal.value).attr("cy", d.y = c.cy.baseVal.value);
        //             d.settedPosition = true;
        //             d.firstMove = false;
        //             d.yourTurn = false;
                    
        //             break;
        //         }
        //     }
        // }
        // if (d.settedPosition == false){
        //     d3.select(event.sourceEvent.target).attr("cx", d.x = d.lastPosX).attr("cy", d.y = d.lastPosY);
        //     return new PawnStateWaitingPlacement();
        // }
        // return new PawnStateWaitingTurn();
    }
}
