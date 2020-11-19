import * as d3 from 'd3';
import { GraphService } from '../_services/graph/graph.service';


export class pawns {
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

      constructor(private graphService: GraphService){

      }
      dragstarted(event, d) {
        this.lastPosX = event.x
        this.lastPosY = event.y
        this.settedPosition = false;
        d3.selectAll("#warningNotYourTurn").remove();
        if(!d.firstMove) {
          this.graphService.showPossibleMove(d.lastSlot)
        }
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
      }
    
      dragged(event, d) {
        d3.select(this as any).attr("cx", event.x).attr("cy", event.y);
      }
    
    dragended(event, d) {
        d3.select(event.sourceEvent.target).attr("stroke", null);
        let circles = document.getElementsByClassName("circle");
        if(d.yourTurn == true) {
          if (d.firstMove == true) {
            for (let i = 0; i<circles.length; i++ ) {
              let c = circles[i] as any;
              if (c.cx.baseVal.value - this.detectRadius <= event.x && event.x <= c.cx.baseVal.value + this.detectRadius) {
                if (c.cy.baseVal.value - this.detectRadius <= event.y && event.y <= c.cy.baseVal.value + this.detectRadius) {
                  d.possiblePoints = this.graphService.showPossibleMove(c)
                  d.lastSlot = c;
                  d3.select(event.sourceEvent.target).attr("cx", d.x = c.cx.baseVal.value).attr("cy", d.y = c.cy.baseVal.value);
                  this.settedPosition = true;
                  d.firstMove = false;
                  /* this.pawn.forEach(p => {
                    if(d != p){
                      p.yourTurn = true;
                    }
                  }); */
                  d.yourTurn = false;
                  break;
                }
              }
            }
            if (this.settedPosition == false) {
              d3.select(event.sourceEvent.target).attr("cx", d.x = this.lastPosX).attr("cy", d.y = this.lastPosY);
            }
          } else if (d.firstMove == false) {
            for (const e of d.possiblePoints) {
              let pos = circles.item(e.index) as any;
              if (pos.cx.baseVal.value - this.detectRadius <= event.x && event.x <= pos.cx.baseVal.value + this.detectRadius) {
                if (pos.cy.baseVal.value - this.detectRadius <= event.y && event.y <= pos.cy.baseVal.value + this.detectRadius) {
                  d.possiblePoints = this.graphService.showPossibleMove(pos)
                  d.lastSlot = pos;
                  d3.select(event.sourceEvent.target).attr("cx", d.x = pos.cx.baseVal.value).attr("cy", d.y = pos.cy.baseVal.value);
                  this.settedPosition = true;
                  /* this.pawn.forEach(p => {
                    if(d != p){
                      p.yourTurn = true;
                    }
                  }); */
                  d.yourTurn = false;
                  break;
                }
              }
            }
            if (this.settedPosition == false) {
              d3.select(event.sourceEvent.target).attr("cx", d.x = this.lastPosX).attr("cy", d.y = this.lastPosY);
            }
          }
        }/* else if (d.yourTurn == false){
          d3.select(event.sourceEvent.target).attr("cx", d.x = this.lastPosX).attr("cy", d.y = this.lastPosY);
          this.svg.append("text")
            .attr("id", "warningNotYourTurn")
            .attr("x", this.width/2 - 150)
            .attr("y", 100)
            .attr("width", 200)
            .text( function (d) { return "Ce n'est pas votre tour !"; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "30px")
            .attr("fill", "red");
        } */
      //this.checkEnd();
      }

}