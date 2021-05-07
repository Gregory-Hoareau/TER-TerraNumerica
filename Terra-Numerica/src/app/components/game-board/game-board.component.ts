import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
//import { thresholdFreedmanDiaconis } from 'd3';
import { Graph } from 'src/app/models/Graph/graph';
import { Cops } from 'src/app/models/Pawn/Cops/cops';
import { Thief } from 'src/app/models/Pawn/Thief/thief';
import { AdventureService } from 'src/app/_services/Adventure/adventure.service';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  private width;
  private height;
  private warningZone: boolean = false;


  private svg;
  private thiefs: Thief[];
  private cops: Cops[];
  public gameMode;

  private isAdventure;
  private movingNodes = false;

  constructor(private graphService: GraphService,
    public gameManager: GameService,
    private activatedRoute: ActivatedRoute,
    private adventureService: AdventureService) {

  }

  ngOnInit(): void {
    this.thiefs = []
    this.cops = []
    this.activatedRoute.queryParams.subscribe(params => {
      // this.graphType = params['graphType'];
      // this.copsNum = +params['copsNum'];
      this.gameMode = params['gameMode'];
      // this.graphParams = this.convertAsNumberArr(params['graphParams']);
      console.log('WE ARE HERE', params['adventure'])
      if(params['adventure'] !== undefined) {
        this.isAdventure = params['adventure'];
        this.gameManager.setIsAdventure(params['adventure']);
      } else {
        console.log('THIS IS NOT AN ADVENTURE');
        this.isAdventure = false
        this.gameManager.setIsAdventure(false);
      }
    })

    this.width = document.getElementById('visualizer').offsetWidth;
    this.height = document.getElementById('visualizer').offsetHeight;
    this.svg = d3.select("#visualizer")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)

    this.graphService.drawGraph(this.svg);
    this.init();
    const board = document.getElementById('visualizer')
    board.style.visibility = 'hidden'
    
    setTimeout(() => {
      d3.select('#top-hud-turn-information-details')
        .text(() => 'Les policiers doivent se placer.')
      board.style.visibility = 'visible'
      this.graphService.stop();
      this.gameManager.update();
      /* if(this.isAdventure) {
        console.log(this.adventureService.getLevelPlayerRole())
      } */
    }, 2000)
  }

  moveNodeMode() {
    this.movingNodes = !this.movingNodes;
    this.graphService.movingPermission(this.movingNodes)
    console.log('HERE', this.movingNodes)
  }

  drawGraph() {
    if (localStorage.getItem("graph") !== null) {
      const savedGraph = JSON.parse(localStorage.getItem("graph")) as Graph
      console.log(savedGraph)
    } else {
      this.graphService.drawGraph(this.svg);
    }
  }

  init() {
    this.gameManager.setValidateTurnCallback(this.validateTurn.bind(this));
    this.gameManager.setDisplayWarningZone(this.seeWarningZone.bind(this));
    for (let i = 0; i < this.gameManager.getCopsNumber(); i++) {
      this.cops.push(new Cops(this.gameManager, this.graphService, 50, 300, i));
    }
    this.thiefs.push(new Thief(this.gameManager, this.graphService, 50, 150));
    this.gameManager.setGameMode(this.gameMode);
    this.graphService.setGameMode(this.gameMode);
    this.gameManager.setPawns(this.thiefs, this.cops);

    this.gameManager.calculateMaxTurnCount();

    let patternPawn = this.svg.append("svg")
      .attr("id", "mySvg")
      .attr("width", 80)
      .attr("height", 80)
      .append("defs")
      .attr("id", "mdef");

    patternPawn.append("pattern")
      .attr("id", "pawnThiefImage")
      .attr("x", 0)
      .attr("y", 0)
      .attr('height', '1')
      .attr('width', '1')
      .append("image")
      .attr("xlink:href", "assets/board/thief.svg")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", 80)
      .attr("width", 80);

    patternPawn.append("pattern")
      .attr("id", "pawnCopsImage")
      .attr("x", 0)
      .attr("y", 0)
      .attr('height', '1')
      .attr('width', '1')
      .append("image")
      .attr("xlink:href", "assets/board/police.svg")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", 80)
      .attr("width", 80)

    /* d3.select("#hud").append("p")
      .attr("id", "main-message")
      .text(() => "Veuillez placer vos pions") */
  }

  getTurnCount() {
    return this.gameManager.getTurnCount();
  }

  getRemainingTurnCount() {
    return this.gameManager.getRemainingTurnCount();
  }

  isGameActionEmpty() {
    return this.gameManager.isGameActionEmpty();
  }

  async validateTurn() {
    this.warningZone = false;
    const res = await this.gameManager.validateTurn();
    /* console.log('RES IS HERE', res) */
    if (res && res.result !== undefined && res.gameTimer !== undefined) {
      /* console.log('HERE WE ARE') */
      res.gameTimer = Math.trunc(res.gameTimer / 1000);
      this.gameManager.registerStats();
      if (res.result.isConfirmed) {
        this.replay();
      } else if (!res.result.isConfirmed) {
        this.gameManager.goBackToMenu();
      }
    }
  }

  cancelAction() {
    this.gameManager.cancelAction();
  }

  seeWarningZone() {
    this.warningZone = !this.warningZone;
    this.cops.forEach(c => {
      this.graphService.showCopsPossibleMoves(c.lastSlot, this.warningZone);
    });
  }

  replay() {
    this.gameManager.replay().then(finished => {
      d3.select('#top-hud-turn-information-details')
        .style('color', 'black')
        .text(() => 'Chargement du plateau de jeu ...');
      this.svg.remove();
      if(!finished) {
        this.ngOnInit();
      }
    });
  }

  displayInfo() {
    Swal.fire({
      title: 'Infos',
      icon: 'info',
      html: this.gameManager.colorInfo()
    })
  }

  gameHasStarted() {
    return this.gameManager.gameHasStarted();
  }

  getMovingNodeClass() {
    return this.movingNodes ? 'moving' : ''
  }

  setWarningZone(boolean: boolean) {
    this.warningZone = boolean;
  }

  isPlayerTurn() {
    return this.gameManager.isPlayerTurn();
  }

}
