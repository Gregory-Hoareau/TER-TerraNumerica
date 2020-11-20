import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import * as d3 from 'd3';
import { environment } from 'src/environments/environment';
import { PawnState } from '../pawn-state';
import { PawnStateWaitingTurn } from '../PawnStateWaitingTurn/pawn-state-waiting-turn';

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
    }
    dragended(event: any, d: any): PawnState {
        d3.select(event.sourceEvent.target).attr("stroke", null);
        let position = {
            x: d.lastPosX,
            y: d.lastPosY,
        }

        let distance = d.detectRadius;
        d3.selectAll(".circle")
            .filter(function(nodeData:any){
                console.log(nodeData);
                return true;
            })
            .each((nodeData:any, id:any, elements:any) => {
                let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
                if (h <= distance) {
                    distance = h;
                    position.x = nodeData.x;
                    position.y = nodeData.y;
                    d.settedPosition = true;
                    d.possiblePoints = d.graphService.showPossibleMove(elements[id]);
                }
            })

        d3.select("."+d.role).attr("cx", d.x = position.x).attr("cy", d.y = position.y);

        if (!d.settedPosition) {
            return this;
        } else {
            return environment.waitingTurnState; 
        }
    }

    machin(data:any){
        return this.edges.includes(data);
    }



        // let circles = document.getElementsByClassName("circle");
        // for (const e of d.possiblePoints) {
        //     let pos = circles.item(e.index) as any;
        //     if (pos.cx.baseVal.value - d.detectRadius <= event.x && event.x <= pos.cx.baseVal.value + d.detectRadius) {
        //         if (pos.cy.baseVal.value - d.detectRadius <= event.y && event.y <= pos.cy.baseVal.value + d.detectRadius) {
        //             d.possiblePoints = d.graphService.showPossibleMove(pos)

        //             d.lastSlot = pos;
        //             d3.select(event.sourceEvent.target).attr("cx", d.x = pos.cx.baseVal.value).attr("cy", d.y = pos.cy.baseVal.value);
        //             d.settedPosition = true;
        //             d.yourTurn = false;
        //             break;
        //         }
        //     }
        // }
        // if (d.settedPosition == false){
        //     d3.select(event.sourceEvent.target).attr("cx", d.x = d.lastPosX).attr("cy", d.y = d.lastPosY);
        //     return this;
        // }
        // return environment.waitingTurnState //new PawnStateWaitingTurn();
}
