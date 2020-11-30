import { Injectable } from '@angular/core';
import { openStdin } from 'process';
import * as d3 from 'd3';
import { Cops } from 'src/app/models/Pawn/Cops/cops';
import { Pawns } from 'src/app/models/Pawn/pawn';
import { PawnState } from 'src/app/models/Pawn/PawnState/pawn-state';
import { Thief } from 'src/app/models/Pawn/Thief/thief';
import { environment } from 'src/environments/environment';
import { GameActionStack } from 'src/app/models/GameActionStack/game-action-stack';
import { GameAction } from 'src/app/models/GameAction/game-action';
import { PawnStateOnTurn } from 'src/app/models/Pawn/PawnState/PawnStateOnTurn/pawn-state-on-turn';
import Swal from 'sweetalert2';
import { GraphService } from '../graph/graph.service';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameMode;
  private cops: Cops[];
  private thiefs: Thief[];
  private thiefTurn = false;
  private watchingPositionList = [];
  private turnCount = 0;
  private turnChanged: boolean = false;
  private placingPawns = true;
  private winner: string;
  private actionStack: GameActionStack;

  private cops_position = [];
  private thiefs_position = [];

  constructor(private graphService: GraphService) {
    this.actionStack = new GameActionStack();
  }

  setThief(thiefs) {
    this.thiefs = thiefs;
  }

  setCops(cops) {
    this.cops = cops;
  }

  updateThiefPosition(thief, pos) {
    let index = this.thiefs.findIndex(t => t == thief);
    
    this.thiefs_position[index] = pos;
    //console.log('THIEF POSITION :', this.thiefs_position)
  }

  updateCopsPosition(cop, pos) {
    let index = this.cops.findIndex(c => c == cop);

    this.cops_position[index] = pos;
    //console.log('COPS POSITION :', this.cops_position)
  }

  update() {
    if(this.placingPawns) {
     /* for(const t of this.thiefs) {
        if(t.isWaitingPlacement()) t.place(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
      } */
      for(const c of this.cops) {
        if(c.isWaitingPlacement()) c.place(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
      }
      this.checkPlacement();
      if(!this.placingPawns) {
        this.startGame();
        d3.select('#main-message')
          .style('color', 'green')
          .text(() => 'C\'est au tour du voleur.');
      }
    } else {
      if(!this.thiefTurn) {
        for(const c of this.cops) {
          c.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
        }
        this.validateTurn();
      } 
      /* else {
        for(const t of this.thiefs) {
          t.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
        }
        this.validateTurn();
      } */
    }
    d3.selectAll("#notificationBubble").remove();
    let pile = this.checkCops();
    if(pile.length != this.cops.length){
      pile.forEach(e => {
        if(e.length != 1)
        this.notificate(e[0], e.length);
      })
    }
    if(this.turnChanged){
      this.recordPosition();
    }
    this.checkTurn();
  }

  private recordPosition(){
    let tmpPositionList = []
      this.turnChanged = false;
      this.thiefs.forEach(e => {
        tmpPositionList.push([e.x,e.y]);
      })
      this.cops.forEach(e => {
        tmpPositionList.push([e.x,e.y]);      
      })
      this.watchingPositionList.push(tmpPositionList);
      return tmpPositionList
  }

  private checkPlacement() {
    let placing = false;
    for(let i=0; i<this.thiefs.length; i++) {
      placing = placing || this.thiefs[i].isWaitingPlacement();
    }
    for(let i=0; i<this.cops.length; i++) {
      placing = placing || this.cops[i].isWaitingPlacement();
    }
    this.placingPawns = placing;
  }

  notificate(pos, number){
    let notif = d3.select("svg")
    .append("g")
    .attr("id", "notificationBubble")
    notif.append('circle')
        .attr("cx", pos.x + 40)
        .attr("cy", pos.y - 55)
        .attr("r", 15)
        .attr("fill", "white")
        .attr("stroke", "black")
    notif.append("text")
        .text(number)
        .style("font-weight", "bold")
        .attr('x', pos.x + 35)
        .attr('y', pos.y - 47.5)                
        .attr("font-size", 20)
  }

  checkCops(){
    let num:number= 0;
    let copsPile = [];
    let tmpCopsPile = []
    let alreadyWatchedCops = []
    this.cops.forEach( c1 => {
      if(!alreadyWatchedCops.includes(c1)){
        tmpCopsPile = []
        tmpCopsPile.push(c1);
        alreadyWatchedCops.push(c1) 
        this.cops.forEach( c2 => {
          if(c1.role != c2.role){
            if(c1.x == c2.x && c1.y == c2.y){
                tmpCopsPile.push(c2);
                alreadyWatchedCops.push(c2)
         }
       }
       })
      if(!copsPile.includes(tmpCopsPile)){
        copsPile.push(tmpCopsPile);
      }
    }
    })
    return copsPile;
  }

  private startGame() {
    this.thiefTurn = true;
    this.setPlayersState(this.thiefs, environment.onTurnState);
    this.turnCount++;
    this.update();
  }

  /* private updateStates() {
    if(this.thiefTurn) {
      let allThiefHasPlayed = true;
      for(let i=0; i< this.thiefs.length; i++) {
        allThiefHasPlayed = allThiefHasPlayed && !this.thiefs[i].onTurn();
      }
      this.thiefTurn = !allThiefHasPlayed;
    } else {
      let allCopsHasPlayed = true;
      for(let i=0; i< this.cops.length; i++) {
        allCopsHasPlayed = allCopsHasPlayed && !this.cops[i].onTurn();
      }
      this.thiefTurn = allCopsHasPlayed;
    }
  } */

  private setPlayersState(players: Pawns[], state: PawnState) {
    for(let i=0; i<players.length; i++) {
      players[i].state = state;
    }
  }

  private checkEnd() {
    let allThiefCapture = false;
    for(let i=0; i<this.thiefs.length; i++) {
      const t = this.thiefs[i];
      for(let j=0; i<this.cops.length; i++) {
        allThiefCapture = allThiefCapture || t.isAtSamePostionAs(this.cops[i]);
      }
    }
    let timerEnd = this.turnCount > 25
    let startWatchingThiefWin = this.turnCount > 10
    if(allThiefCapture) this.winner = 'Les Policiers ont gagnés';
    else if(timerEnd) this.winner = 'Le Voleur est vainqueur';
    else if(startWatchingThiefWin && this.checkSamePositionAsPreviously()){
        this.winner = 'Le Voleur est vainqueur';
    }
    return allThiefCapture || timerEnd || startWatchingThiefWin && this.checkSamePositionAsPreviously();
  }

  getTurnCount() {
    return this.turnCount;
  }

  setGameMode(gameMode){
    this.gameMode = gameMode
  }

  validateTurn() {

    this.thiefTurn = !this.thiefTurn;
    this.clearActions();
    if(this.thiefTurn) {
      this.turnChanged = true;
      this.turnCount++;
      this.setPlayersState(this.cops, environment.waitingTurnState);
      this.setPlayersState(this.thiefs, environment.onTurnState);
      d3.select('#main-message')
        .style('color', 'green')
        .text(() => 'C\'est au tour du voleur.');
    } 
    else {
      this.setPlayersState(this.thiefs, environment.waitingTurnState);
      this.setPlayersState(this.cops, environment.onTurnState);
      d3.select('#main-message')
        .style('color', 'blue')
        .text(() => 'C\'est au tour des policiers.');
    }
    if(this.checkEnd()) {
      Swal.fire({
        title: this.winner,
        text:  'Nombre de tours écoulés : ' + this.turnCount + ' Mode de Jeu : facile' + ' Nombre de policiers : ' + this.cops.length + ' Nombre de Voleurs : ' + this.thiefs.length,
        icon: 'success',
        confirmButtonText: 'Rejouer'
      }).then((result) => {
        if(result.isConfirmed){
          console.log(this.watchingPositionList)
          this.watchingPositionList = []
          console.log(this.watchingPositionList)
          window.location.reload();
        }
      })
    } else {
      this.update()
    }
  }
  
  checkTurn(){
    this.thiefs.forEach(t => {
      if(t.state === environment.onTurnState){
        d3.select('.'+t.role)
          .style("opacity", 1)
      }else if(t.state === environment.waitingTurnState){
        d3.select('.'+t.role)
          .style("opacity", 0.60);
      }
    });
    this.cops.forEach(c => {
      if(c.state === environment.onTurnState){
        d3.select('.'+c.role)
        .style("opacity", 1);
      }else if(c.state === environment.waitingTurnState){
        d3.select('.'+c.role)
          .style("opacity", 0.60);
      }
    });
  }

  //GameAction related function
  addGameAction(action: GameAction) {
    this.actionStack.push(action);
  }

  cancelAction(): boolean {
    const sucess = this.actionStack.cancelAction();
    this.checkTurn();
    return sucess;
  }

  isGameActionEmpty() {
    return this.actionStack.isEmpty();
  }

  peekAction() {
    return this.actionStack.peek();
  }

  private clearActions() {
    this.actionStack.clear();
  }

  private checkSamePositionAsPreviously() {
    return this.watchingPositionList.includes(this.recordPosition());
  }

}
