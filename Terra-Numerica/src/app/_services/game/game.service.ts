import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Cops } from 'src/app/models/Pawn/Cops/cops';
import { Pawns } from 'src/app/models/Pawn/pawn';
import { PawnState } from 'src/app/models/Pawn/PawnState/pawn-state';
import { Thief } from 'src/app/models/Pawn/Thief/thief';
import { environment } from 'src/environments/environment';
import { GameActionStack } from 'src/app/models/GameActionStack/game-action-stack';
import { GameAction } from 'src/app/models/GameAction/game-action';
import Swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';
import { GraphService } from '../graph/graph.service';
import { IStrategy } from 'src/app/models/Strategy/istrategy';
import { RandomStrategy } from 'src/app/models/Strategy/RandomStrategy/random-strategy';
import { TrackingStrategy } from 'src/app/models/Strategy/Cop/TrackingStrategy/tracking-strategy';
import { RunawayStrategy } from 'src/app/models/Strategy/Thief/RunawayStrategy/runaway-strategy';
import { WatchingStrategy } from 'src/app/models/Strategy/Cop/WatchingStrategy/watching-strategy';
import { GridStrategy } from 'src/app/models/Strategy/Cop/GridStrategy/grid-strategy';
import { OneCopsWinStrategy } from 'src/app/models/Strategy/Cop/OneCopsWinStrategy/one-cops-win-strategy';
import { StatisticService } from '../statistic/statistic.service';
import { AdventureService } from '../Adventure/adventure.service';


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
  private alreadyEnconteredPos: boolean = false;
  private maxTurnCount: number = 25;

  private isAdventure: boolean = false;

  private copsNumber = 0;
  private opponentType = null;
  private thieftSpeed = 1;

  private HUD_TURN_DETAILS: string = '#top-hud-turn-information-details';

  private cops_position = [];
  private thiefs_position = [];
  private gameTimer;

  private ai_thief_strat: () => IStrategy;
  private ai_cops_strat: () => IStrategy;
  private ai_side = 'cops'; // undefined if no ai, 'cops' if cops are play by ai, 'thief' if thief is play by ai
  private validateTurnCallback: () => void;
  private endLevelCallback: () => Promise<void>;

  constructor(private router: Router, private graphService: GraphService, private stat: StatisticService) {
    this.actionStack = new GameActionStack();
    if (localStorage.getItem("cops") !== null) {
      this.copsNumber = parseInt(localStorage.getItem("cops"));
    }
    if (localStorage.getItem("ai") !== null) {
      this.ai_side = localStorage.getItem("ai");
    }
  }

  setEndLevelCallback(callback) {
    this.endLevelCallback = callback;
  }

  setIsAdventure(adventure) {
    this.isAdventure = adventure;
  }

  setThiefSpeed(speed) {
    this.thieftSpeed = speed;
    this.graphService.setThiefSpeed(speed)
  }

  getThiefSpeed() {
    return this.thieftSpeed;
  }

  setValidateTurnCallback(callback) {
    this.validateTurnCallback = callback;
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
    switch (this.gameMode) {
      case 'medium':
        switch (this.graphService.getGraph().typology) {
          case 'grid':
            this.ai_cops_strat = () => {
              return new GridStrategy(this.graphService, this);
            };
            break;
          default:
            this.ai_cops_strat = () => {
              return new TrackingStrategy();
            }
        }
        this.ai_thief_strat = () => {
          return new RunawayStrategy();
        };
        break;
      case 'extreme':
      case 'hard':
        switch (this.graphService.getGraph().typology) {
          case 'grid':
            this.ai_cops_strat = () => {
              return new WatchingStrategy();
            };
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
    for (const t of this.thiefs) {
      t.setStrategy(this.ai_thief_strat());
    }
  }

  private setCops(cops) {
    this.cops = cops;
    for (const c of this.cops) {
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
    this.graphService.updateCopsPositions(this.cops_position)
  }

  private allThiefsPlayed() {
    let allPlayed = true;
    for (const t of this.thiefs) {
      allPlayed = allPlayed && t.hasPlayed();
    }
    return allPlayed;
  }

  private allCopsPlayed() {
    let allPlayed = true;
    for (const c of this.cops) {
      allPlayed = allPlayed && c.hasPlayed();
    }
    return allPlayed;
  }

  update() {
    if (this.placingPawns) {
      //Check if there is AI
      if (this.ai_side) {
        // Check if the AI is a thief
        if (this.ai_side === 'thief' && !this.placingCops) {
          for (const t of this.thiefs) {
            if (t.isWaitingPlacement()) t.place(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
          }
        }
        //Check if AI is cops
        //console.log('AI SIDE', this.ai_side)
        //console.log('TURN TO PLACE COPS', this.placingCops)
        if (this.ai_side === 'cops' && this.placingCops) {
          //console.log('HERE')
          for (const c of this.cops) {
            //console.log('CHECK IF COPS ARE PLACED')
            if (c.isWaitingPlacement()) {
              //console.log('FOUND A COPS WAITING TO BE PLACED')
              c.place(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
            }
          }
        }

      } //End check if there is AI

      this.checkPlacement();
      if (!this.placingCops && this.placingPawns) {
        d3.select(this.HUD_TURN_DETAILS)
          .text(() => 'Le voleur doit se placer.');
        if (this.ai_side === 'thief') this.update();
      }
      if (!this.placingPawns) {
        d3.select(this.HUD_TURN_DETAILS)
          .style('color', 'blue')
          .text(() => 'C\'est au tour des policiers.');
        this.startGame();
      }
    } else {
      // Check if there is an AI
      if (this.ai_side) {
        // Check if this is cops turn and if AI is cops
        if (this.ai_side === 'cops' && !this.thiefTurn) {
          for (const c of this.cops) {
            c.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
          }
          this.validateTurnCallback(); // DO NOT REFACTOR THESE LINES OUTSIDE OF THEIR RESPECTIVES IF
        }
        // check if this is thief turn and if AI is thief
        else if (this.ai_side === 'thief' && this.thiefTurn) {
          for (const t of this.thiefs) {
            t.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
          }
          this.validateTurnCallback(); // DO NOT REFACTOR THESE LINES OUTSIDE OF THEIR RESPECTIVES IF
        }
      } // End Check if there is an AI

      //Beta for extreme mode
      if (this.gameMode === 'extreme') {
        if (this.ai_side === 'undefined' || this.ai_side === undefined) { // if it's a Player VS Player game
          if (this.thiefTurn) {
            if (this.allThiefsPlayed()) this.validateTurnCallback()
          } else if (!this.thiefTurn) {
            if (this.allCopsPlayed()) this.validateTurnCallback()
          }
        } else { // if it's a Player VS AI game
          if (this.ai_side === 'cops' && this.thiefTurn) {
            if (this.allThiefsPlayed()) this.validateTurnCallback();
          } else if (this.ai_side === 'thief' && !this.thiefTurn) {
            if (this.allCopsPlayed()) this.validateTurnCallback();
          }
        }
      }

    }
    d3.selectAll("#notificationBubble").remove();
    let pile = this.checkCops();
    if (pile.length != this.cops.length) {
      pile.forEach(e => {
        if (e.length != 1)
          this.notificate(e[0], e.length);
      })
    }
    if (this.turnChanged) {
      this.watchingPositionList.push(JSON.stringify(this.recordPosition()));
    }
    this.checkTurn();
  }

  private recordPosition() {
    let tmpPositionList = []
    this.turnChanged = false;
    this.thiefs.forEach(e => {
      tmpPositionList.push([e.x, e.y]);
    })
    this.cops.forEach(e => {
      tmpPositionList.push([e.x, e.y]);
    })
    return tmpPositionList
  }

  private checkPlacement() {
    let placing = false;
    let cops = false;
    for (let i = 0; i < this.thiefs.length; i++) {
      placing = placing || this.thiefs[i].isWaitingPlacement();
    }
    for (let i = 0; i < this.cops.length; i++) {
      placing = placing || this.cops[i].isWaitingPlacement();
      cops = cops || this.cops[i].isWaitingPlacement();
    }
    this.placingPawns = placing;
    this.placingCops = cops
  }

  notificate(pos, number) {
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

  checkCops() {
    let num: number = 0;
    let copsPile = [];
    let tmpCopsPile = []
    let alreadyWatchedCops = []
    this.cops.forEach(c1 => {
      if (!alreadyWatchedCops.includes(c1)) {
        tmpCopsPile = []
        tmpCopsPile.push(c1);
        alreadyWatchedCops.push(c1)
        this.cops.forEach(c2 => {
          if (c1.role != c2.role) {
            if (c1.x == c2.x && c1.y == c2.y) {
              tmpCopsPile.push(c2);
              alreadyWatchedCops.push(c2)
            }
          }
        })
        if (!copsPile.includes(tmpCopsPile)) {
          copsPile.push(tmpCopsPile);
        }
      }
    })
    return copsPile;
  }

  private startGame() {
    this.thiefTurn = false;
    this.gameTimer = Date.now();
    this.setPlayersState(this.cops, environment.onTurnState);
    this.turnCount++;
    this.update();
  }

  private setPlayersState(players: Pawns[], state: PawnState) {
    for (let i = 0; i < players.length; i++) {
      players[i].state = state;
    }
  }

  private checkEnd() {
    let allThiefCapture = false;
    for (let i = 0; i < this.thiefs.length; i++) {
      const t = this.thiefs[i];
      for (let j = 0; i < this.cops.length; i++) {
        allThiefCapture = allThiefCapture || t.isAtSamePostionAs(this.cops[i]);
      }
    }
    let timerEnd = this.turnCount > this.maxTurnCount;
    let startWatchingThiefWin = this.turnCount > 10
    if (allThiefCapture) this.winner = 'Les Policiers ont gagné';
    else if (timerEnd) this.winner = 'Le Voleur est vainqueur car le temps est écoulé';
    else if (startWatchingThiefWin && this.checkSamePositionAsPreviously()) {
      this.winner = 'Le Voleur est vainqueur par stratégie gagnante';
    }
    return allThiefCapture || timerEnd || startWatchingThiefWin && this.alreadyEnconteredPos;
  }

  getTurnCount() {
    return this.turnCount;
  }

  setGameMode(gameMode) {
    this.gameMode = gameMode
  }

  async validateTurn() {
    console.log('IS CALLED GameManager#validateTurn')
    d3.selectAll(".circle").style("fill", '#69b3a2');
    this.thiefTurn = !this.thiefTurn;
    this.clearActions();
    if (this.thiefTurn) {
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
    if (this.checkEnd()) {
      if(!this.isAdventure) { // if it's a free game
        let endTime: any = Date.now();
        this.gameTimer = endTime - this.gameTimer;
        const result = await Swal.fire({
          title: this.winner,
          text: 'Nombre de tours écoulés : ' + this.turnCount + ' Mode de Jeu : ' + this.getGameMode(this.gameMode) + ' Nombre de policiers : ' + this.cops.length + ' Nombre de Voleurs : ' + this.thiefs.length,
          icon: 'success',
          confirmButtonText: 'Rejouer',
          showCancelButton: true,
          cancelButtonText: 'Retour au Menu'
        })
        return { result: result, gameTimer: this.gameTimer };
      } else { // if it's an adventure
        console.log('It is the end of a level of the adventure');
        //this.adventureService.launchNextLevel();
        //this.endLevelCallback();
        const result = await Swal.fire({
          title: 'Fin du niveau',
          icon: 'success',
          text: 'TEXTE DE FIN DE NIVEAU',
          confirmButtonText: 'Passer au niveau suivant',
        })
        console.log(result);
        return { result: result, gameTimer: this.gameTimer };
      }
    } else {
      this.update()
    }
  }

  private getGameMode(mode: string) {
    switch (mode) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Normal';
      case 'hard':
        return 'Difficile';
      case 'extreme':
        return 'Extrême';
      default:
        return 'Inconnu';
    }
  }

  registerStats() {
    this.stat.postStatistic({
      gameMode: this.gameMode,
      turnCount: this.turnCount,
      copsNumber: this.copsNumber,
      timer: this.gameTimer,
      graphType: this.graphService.getGraph().typology,
    })
  }

  goBackToMenu() {
    this.reset();
    this.router.navigate(['/menu']);
  }

  async replay() {
    this.watchingPositionList = []
    this.watchingPositionListStep2 = []
    this.alreadyEnconteredPos = false

    this.turnCount = 0;
    this.turnChanged = false;
    this.placingPawns = true;
    this.placingCops = true;
    this.actionStack = new GameActionStack()
    //window.location.reload();
    
    if(this.isAdventure) {
      await this.endLevelCallback();
      return true
    } else {
      const extras: NavigationExtras = {
        queryParams: {
          gameMode: this.gameMode
        }
      }
      this.router.navigate(['/board'], extras)
      return true;
    }
  }

  reset() {
    this.watchingPositionList = []
    this.watchingPositionListStep2 = []
    this.alreadyEnconteredPos = false
    this.turnCount = 0;
    this.placingCops = true;
    this.thiefTurn = true;
    this.placingPawns = true;
    this.gameTimer = 0;
  }

  checkTurn() {
    this.thiefs.forEach(t => {
      if (t.state === environment.onTurnState) {
        d3.select('.' + t.role)
          .style("opacity", 1)
      } else if (t.state === environment.waitingTurnState) {
        d3.select('.' + t.role)
          .style("opacity", 0.60);
      }
    });
    this.cops.forEach(c => {
      if (c.state === environment.onTurnState) {
        d3.select('.' + c.role)
          .style("opacity", 1);
      } else if (c.state === environment.waitingTurnState) {
        d3.select('.' + c.role)
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
    if (this.thiefTurn && this.watchingPositionList.includes(JSON.stringify(this.recordPosition()))) {
      this.watchingPositionListStep2.push(JSON.stringify(this.recordPosition()));
    }
    return this.alreadyEnconteredPos;
  }

  rules() {
    return 'Dans ce jeu, deux camps s’affrontent : les gendarmes dont le but est d’attraper le voleur le plus rapidement possible, et le voleur qui doit quant à lui fuir le plus longtemps possible et si possible ne jamais se faire attraper pour gagner.\n'
      + 'Les gendarmes sont placés en premier sur des sommets du graphe. Une fois tous les pions placés, les gendarmes se déplacent en premier. Les pions ne peuvent se déplacer que sur les sommets adjacents au sommet sur lequel ils se trouvent mais ils peuvent aussi choisir de rester sur le sommet sur lequel ils se trouvent actuellement.\n'
      + `Les gendarmes gagnent si le voleur est attrapé, c’est-à-dire si un des gendarmes se trouve sur le même sommet que le voleur. Le voleur est considéré comme vainqueur, soit s\'il est parvenu à ne pas se faire attraper par un gendarme pendant ${this.maxTurnCount} tours ou soit si l’intégralité des pions sur le plateau sont amenés à repasser 3 fois dans une position où ils étaient déjà, afin de détecter les cas où le voleur peut échapper aux gendarmes indéfiniment.`
  }

  rulesHtml() {
    return '<p>Dans ce jeu, deux camps s’affrontent : les gendarmes dont le but est d’attraper le voleur le plus rapidement possible, et le voleur qui doit quant à lui fuir le plus longtemps possible et si possible ne jamais se faire attraper pour gagner.</p>'
      + '<p>Les gendarmes sont placés en premier sur des sommets du graphe. Une fois tous les pions placés, les gendarmes se déplacent en premier. Les pions ne peuvent se déplacer que sur les sommets adjacents au sommet sur lequel ils se trouvent mais ils peuvent aussi choisir de rester sur le sommet sur lequel ils se trouvent actuellement.</p>'
      + `<p>Les gendarmes gagnent si le voleur est attrapé, c’est-à-dire si un des gendarmes se trouve sur le même sommet que le voleur. Le voleur est considéré comme vainqueur, soit s\'il est parvenu à ne pas se faire attraper par un gendarme pendant ${this.maxTurnCount} tours ou soit si l’intégralité des pions sur le plateau sont amenés à repasser 3 fois dans une position où ils étaient déjà, afin de détecter les cas où le voleur peut échapper aux gendarmes indéfiniment.</p>`
  }

  colorInfo() {
    return '<p><i class="fas fa-circle" style="color:red;"></i> : Représente les sommets contrôler par les policiers. Visible en appuyant sur le bouton "zone de danger".</p><br>'
      + '<p><i class="fas fa-circle" style="color:blue;"></i> : Représente le sommet de départ de pions lors de son mouvement.</p><br>'
      + '<p><i class="fas fa-circle" style="color:orange;"></i> : Représente les sommets qui seront contrôle par un pions après sont mouvement.</p><br>'
      + '<p><i class="fas fa-circle" style="color:#05B800;"></i> : Représente les sommets accessible par les pions pour ce tour.</p><br>'
  }

}
