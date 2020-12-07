import { IfStmt, templateJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { thresholdFreedmanDiaconis } from 'd3';
import { Graph } from 'src/app/models/Graph/graph';
import { Cops } from 'src/app/models/Pawn/Cops/cops';
import { Thief } from 'src/app/models/Pawn/Thief/thief';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';

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
  private thiefs: Thief[] = [];
  private cops: Cops[] = [];
  public gameMode;

  constructor(private graphService: GraphService,
              public gameManager: GameService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      // this.graphType = params['graphType'];
      // this.copsNum = +params['copsNum'];
      this.gameMode = params['gameMode'];
      // this.graphParams = this.convertAsNumberArr(params['graphParams']);
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
        .text(() => 'Placez vos pions.')
      board.style.visibility = 'visible'
      this.gameManager.update();
    }, 2000)
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

    for(let i = 0; i < this.gameManager.getCopsNumber() ; i++){
      this.cops.push(new Cops(this.gameManager, this.graphService, 50, 300, i));
    }
    this.thiefs.push(new Thief(this.gameManager, this.graphService, 50, 150));
    this.gameManager.setGameMode(this.gameMode);
    this.graphService.setGameMode(this.gameMode);
    this.gameManager.setPawns(this.thiefs, this.cops)

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
                .attr('height','1')
                .attr('width','1')
                .append("image")
                  .attr("xlink:href", "../../assets/thief.svg")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", 80)
                  .attr("width", 80);

    patternPawn.append("pattern")
                .attr("id", "pawnCopsImage")
                .attr("x", 0)
                .attr("y", 0)
                .attr('height','1')
                .attr('width','1')
                .append("image")
                  .attr("xlink:href", "../../assets/police.svg")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", 80)
                  .attr("width", 80)

    /* d3.select("#hud").append("p")
      .attr("id", "main-message")
      .text(() => "Veuillez placer vos pions") */
  }

  // showPossibleMoves(event){
  //   return this.graphService.showPossibleMove(event);
  // }

  getTurnCount() {
    return this.gameManager.getTurnCount();
  }

  isGameActionEmpty() {
    return this.gameManager.isGameActionEmpty();
  }

  validateTurn() {
    this.gameManager.validateTurn();
  }

  cancelAction() {
    this.gameManager.cancelAction();
  }

  seeWarningZone(){
    this.warningZone = !this.warningZone;
    this.cops.forEach(c => {
      this.graphService.showCopsPossibleMoves(c.lastSlot, this.warningZone);
  });
  console.log(this.warningZone)
}

}
