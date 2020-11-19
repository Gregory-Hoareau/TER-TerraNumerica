import * as d3 from 'd3';
import { PawnState } from '../pawn-state';
import { PawnStateWaitingTurn } from '../PawnStateWaitingTurn/pawn-state-waiting-turn';

export class PawnStateOnTurn implements PawnState {
    dragstarted(event: any, d: any) {
        d.lastPosX = event.x
        d.lastPosY = event.y
        d.settedPosition = false;
        d.graphService.showPossibleMove(d.lastSlot)
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event: any, d: any) {
        d3.select(this as any).attr("cx", event.x).attr("cy", event.y);
    }
    dragended(event: any, d: any): PawnState {
        d3.select(event.sourceEvent.target).attr("stroke", null);
        let circles = document.getElementsByClassName("circle");
        for (const e of d.possiblePoints) {
            let pos = circles.item(e.index) as any;
            if (pos.cx.baseVal.value - d.detectRadius <= event.x && event.x <= pos.cx.baseVal.value + d.detectRadius) {
                if (pos.cy.baseVal.value - d.detectRadius <= event.y && event.y <= pos.cy.baseVal.value + d.detectRadius) {
                    d.possiblePoints = d.graphService.showPossibleMove(pos)
                    d.lastSlot = pos;
                    d3.select(event.sourceEvent.target).attr("cx", d.x = pos.cx.baseVal.value).attr("cy", d.y = pos.cy.baseVal.value);
                    d.settedPosition = true;
                    d.yourTurn = false;
                    break;
                }
            }
        }
        if (d.settedPosition == false){
            d3.select(event.sourceEvent.target).attr("cx", d.x = d.lastPosX).attr("cy", d.y = d.lastPosY);
            return new PawnStateOnTurn();
        }
        return new PawnStateWaitingTurn();
    }
}
