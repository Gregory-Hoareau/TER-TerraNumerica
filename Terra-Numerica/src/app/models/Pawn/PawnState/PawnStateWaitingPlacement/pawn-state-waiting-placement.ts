import * as d3 from 'd3';
import { PawnState } from '../pawn-state';
import { PawnStateWaitingTurn } from '../PawnStateWaitingTurn/pawn-state-waiting-turn';

export class PawnStateWaitingPlacement implements PawnState {
    dragstarted(event: any, d: any) {
        d.lastPosX = event.x
        d.lastPosY = event.y
        d.settedPosition = false;
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event: any, d: any) {
        d3.select(d).attr("cx", event.x).attr("cy", event.y);
    }
    dragended(event: any, d: any): PawnState {
        console.log(event.sourceEvent.target)
        d3.select(event.sourceEvent.target).attr("stroke", null);
        let circles = document.getElementsByClassName("circle");
        for (let i = 0; i<circles.length; i++ ) {
            let c = circles[i] as any;
            if (c.cx.baseVal.value - d.detectRadius <= event.x && event.x <= c.cx.baseVal.value + d.detectRadius) {
                if (c.cy.baseVal.value - d.detectRadius <= event.y && event.y <= c.cy.baseVal.value + d.detectRadius) {
                    d.possiblePoints = d.graphService.showPossibleMove(c)
                    d.lastSlot = c;
                    d3.select(event.sourceEvent.target).attr("cx", d.x = c.cx.baseVal.value).attr("cy", d.y = c.cy.baseVal.value);
                    d.settedPosition = true;
                    d.firstMove = false;
                    d.yourTurn = false;
                    break;
                }
            }
        }
        if (d.settedPosition == false)
            d3.select(event.sourceEvent.target).attr("cx", d.x = d.lastPosX).attr("cy", d.y = d.lastPosY);
        return new PawnStateWaitingTurn();
    }
}
