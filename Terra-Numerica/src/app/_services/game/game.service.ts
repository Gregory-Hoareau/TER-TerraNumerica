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
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GraphService } from '../graph/graph.service';
import { IStrategy } from 'src/app/models/Strategy/istrategy';
import { RandomStrategy } from 'src/app/models/Strategy/RandomStrategy/random-strategy';
import { TrackingStrategy } from 'src/app/models/Strategy/Cop/TrackingStrategy/tracking-strategy';
import { RunawayStrategy } from 'src/app/models/Strategy/Thief/RunawayStrategy/runaway-strategy';
import { WatchingStrategy } from 'src/app/models/Strategy/Cop/WatchingStrategy/watching-strategy';
import { GridStrategy } from 'src/app/models/Strategy/Cop/GridStrategy/grid-strategy';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { OneCopsWinStrategy } from 'src/app/models/Strategy/Cop/OneCopsWinStrategy/one-cops-win-strategy';
import { POINT_CONVERSION_COMPRESSED } from 'constants';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameMode;
  private cops: Cops[];
  private thiefs: Thief[];
  private thiefTurn = false;
  private watchingPositionList = [];
  private watchingPositionListStep2 = [];
  private turnCount = 0;
  private turnChanged: boolean = false;
  private placingPawns = true;
  private placingCops = true;
  private winner: string;
  private actionStack: GameActionStack;
  private alreadyEnconteredPos: boolean = false

  private copsNumber = 0;
  private opponentType = null;

  private HUD_TURN_DETAILS: string = '#top-hud-turn-information-details';

  private cops_position = [];
  private thiefs_position = [];

  private ai_thief_strat: () => IStrategy;
  private ai_cops_strat: () => IStrategy;
  private ai_side = 'cops'; // undefined if no ai, 'cops' if cops are play by ai, 'thief' if thief is play by ai

  constructor(private router: Router, private graphService: GraphService) {
    this.actionStack = new GameActionStack();
    if (localStorage.getItem("cops") !== null) {
      this.copsNumber = parseInt(localStorage.getItem("cops"));
    }
    if (localStorage.getItem("ai") !== null) {
      this.ai_side = localStorage.getItem("ai");
    }
  }

  copsArePlaced() {
    return this.cops_position.filter(p => p).length === this.copsNumber;
  }

  setCopsNumber(n: number) {
    this.copsNumber = n;
    localStorage.setItem("cops", n.toString());
  }

  getCopsNumber(): number {
    return this.copsNumber;
  }

  setOpponentType(type: string) {
    this.opponentType = type;
  }

  setAiSide(side: string) {
    this.ai_side = side;
    localStorage.setItem("ai", side);
  }

  chooseAIStrat() {
    switch(this.gameMode) {
      case 'medium':
        this.ai_cops_strat = () => {
          return new TrackingStrategy();
        };
        this.ai_thief_strat = () => {
          return new RunawayStrategy();
        };
        break;
      case 'hard':
        switch(this.graphService.getGraph().typology) {
          case 'grid':
            if(this.copsNumber === 2){
              this.ai_cops_strat = () => {
                return new WatchingStrategy();
              };
            }else if(this.copsNumber>2){
              this.ai_cops_strat = () => {
                return new GridStrategy(this.graphService, this);
              };
            }else{
              this.ai_cops_strat = () => {
                return new TrackingStrategy();
              };
            } 
            break;
          case 'copsAlwaysWin':
            this.ai_cops_strat = () => {
              return new OneCopsWinStrategy();
            };
            break;
          default:
            this.ai_cops_strat = () => {
              return new WatchingStrategy();
            };
            break;
        }
        this.ai_thief_strat = () => {
          return new RunawayStrategy();
        };
        break;
      case 'easy':
      default:
        this.ai_cops_strat = () => {
          return new RandomStrategy();
        };
        this.ai_thief_strat = () => {
          return new RandomStrategy();
        };
        break;
    }
  }

  setPawns(thiefs, cops) {
    this.chooseAIStrat();
    this.setThief(thiefs);
    this.setCops(cops);
  }

  private setThief(thiefs) {
    this.thiefs = thiefs;
    for(const t of this.thiefs) {
      t.setStrategy(this.ai_thief_strat());
    }
  }

  private setCops(cops) {
    this.cops = cops;
    for(const c of this.cops) {
      c.setStrategy(this.ai_cops_strat());
    }
  }

  updateThiefPosition(thief, pos) {
    let index = this.thiefs.findIndex(t => t == thief);
    this.thiefs_position[index] = pos;
  }

  updateCopsPosition(cop, pos) {
    let index = this.cops.findIndex(c => c == cop);
    this.cops_position[index] = pos;
  }

  update() {
    if(this.placingPawns) {
      //Check if there is AI
      if(this.ai_side) {
        // Check if the AI is a thief
        if(this.ai_side === 'thief' && !this.placingCops) {
          for(const t of this.thiefs) {
            if(t.isWaitingPlacement()) t.place(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
          }
        }
        //Check if AI is cops
        if(this.ai_side === 'cops' && this.placingCops) {
          for(const c of this.cops) {
            if(c.isWaitingPlacement()) c.place(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
          }
        }
      
      } //End check if there is AI

      this.checkPlacement();
      if(!this.placingCops && this.placingPawns) {
        d3.select(this.HUD_TURN_DETAILS)
          .text(() => 'Le voleur doit se placer.');
        if(this.ai_side === 'thief') this.update();
      }
      if(!this.placingPawns) {
        d3.select(this.HUD_TURN_DETAILS)
          .style('color', 'blue')
          .text(() => 'C\'est au tour des policiers.');
        this.startGame();
      }
    } else {
      // Check if there is an AI
      if(this.ai_side) {
        // Check if this is cops turn and if AI is cops
        if(this.ai_side === 'cops' && !this.thiefTurn) {
          for(const c of this.cops) {
            c.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
          }
          this.validateTurn(); // DO NOT REFACTOR THESE LINES OUTSIDE OF THEIR RESPECTIVES IF
        } 
        // check if this is thief turn and if AI is thief
        else if(this.ai_side === 'thief' && this.thiefTurn) {
          for(const t of this.thiefs) {
            t.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
          }
          this.validateTurn(); // DO NOT REFACTOR THESE LINES OUTSIDE OF THEIR RESPECTIVES IF
        }
      } // End Check if there is an AI
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
      this.watchingPositionList.push(JSON.stringify(this.recordPosition()));
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
      return tmpPositionList
  }

  private checkPlacement() {
    let placing = false;
    let cops = false;
    for(let i=0; i<this.thiefs.length; i++) {
      placing = placing || this.thiefs[i].isWaitingPlacement();
    }
    for(let i=0; i<this.cops.length; i++) {
      placing = placing || this.cops[i].isWaitingPlacement();
      cops = cops || this.cops[i].isWaitingPlacement();
    }
    this.placingPawns = placing;
    this.placingCops = cops
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
    let num: number = 0;
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
    this.thiefTurn = false;
    this.setPlayersState(this.cops, environment.onTurnState);
    this.turnCount++;
    this.update();
  }

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
    else if(timerEnd) this.winner = 'Le Voleur est vainqueur car le temps est écoulé';
    else if(startWatchingThiefWin && this.checkSamePositionAsPreviously()){
        this.winner = 'Le Voleur est vainqueur par stratégie gagnante';
    }
    return allThiefCapture || timerEnd || startWatchingThiefWin && this.alreadyEnconteredPos;
  }

  getTurnCount() {
    return this.turnCount;
  }

  setGameMode(gameMode){
    this.gameMode = gameMode
  }

  validateTurn() {
    d3.selectAll(".circle").style("fill", '#69b3a2');
    this.thiefTurn = !this.thiefTurn;
    this.clearActions();
    if(this.thiefTurn) {
      this.turnChanged = true;
      this.turnCount++;
      this.setPlayersState(this.cops, environment.waitingTurnState);
      this.setPlayersState(this.thiefs, environment.onTurnState);
      d3.select(this.HUD_TURN_DETAILS)
        .style('color', 'green')
        .text(() => 'C\'est au tour du voleur.');
    } 
    else {
      this.setPlayersState(this.thiefs, environment.waitingTurnState);
      this.setPlayersState(this.cops, environment.onTurnState);
      d3.select(this.HUD_TURN_DETAILS)
        .style('color', 'blue')
        .text(() => 'C\'est au tour des policiers.');
    }
    if(this.checkEnd()) {
      Swal.fire({
        title: this.winner,
        text:  'Nombre de tours écoulés : ' + this.turnCount + ' Mode de Jeu : ' + this.gameMode + ' Nombre de policiers : ' + this.cops.length + ' Nombre de Voleurs : ' + this.thiefs.length,
        icon: 'success',
        confirmButtonText: 'Rejouer',
        showCancelButton: true,
        cancelButtonText: 'Retour au Menu'
      }).then((result) => {
        if(result.isConfirmed){
          this.replay();
        }else if(!result.isConfirmed){
          this.goBackToMenu();
        }
      })
    } else {
      this.update()
    }
  }

  goBackToMenu(){
    this.reset();
    this.router.navigate(['/menu']);
  }

  replay(){
    this.watchingPositionList = []
    this.watchingPositionListStep2 = []
    this.alreadyEnconteredPos = false
    window.location.reload();
  }

  reset(){
    this.watchingPositionList = []
    this.watchingPositionListStep2 = []
    this.alreadyEnconteredPos = false
    this.turnCount = 0;
    this.thiefTurn = true;
    this.placingPawns = true;
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
    this.alreadyEnconteredPos = (this.thiefTurn && this.watchingPositionListStep2.includes(JSON.stringify(this.recordPosition())))
    if(this.thiefTurn && this.watchingPositionList.includes(JSON.stringify(this.recordPosition()))){
      this.watchingPositionListStep2.push(JSON.stringify(this.recordPosition()));
    }
    return this.alreadyEnconteredPos;
  }

}
