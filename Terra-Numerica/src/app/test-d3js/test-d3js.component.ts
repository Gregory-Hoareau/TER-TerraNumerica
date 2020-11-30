import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { GraphService } from '../_services/graph/graph.service';
import { Thief } from '../models/Pawn/Thief/thief';
import { Cops } from '../models/Pawn/Cops/cops';
import { GameService } from '../_services/game/game.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-d3js',
  templateUrl: './test-d3js.component.html',
  styleUrls: ['./test-d3js.component.scss']
})
export class TestD3jsComponent implements OnInit {
  private width;
  private height;
  

  private svg;
  private thiefs: Thief[] = [];
  private cops: Cops[] = [];
  private gameMode;

  constructor(private graphService: GraphService, private gameManager: GameService,
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
  }

  init() {

    for(let i = 0; i < this.gameManager.getCopsNumber() ; i++){
      this.cops.push(new Cops(this.gameManager, this.graphService, 50, 300, i));
    }
    this.thiefs.push(new Thief(this.gameManager, this.graphService, 50, 150));
    this.gameManager.setGameMode(this.gameMode);
    this.graphService.setGameMode(this.gameMode);
    this.gameManager.setCops(this.cops);
    this.gameManager.setThief(this.thiefs)
    this.gameManager.update();

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
                .attr("height", 80)
                .attr("width", 80)
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
                .attr("height", 80)
                .attr("width", 80)
                .append("image")
                  .attr("xlink:href", "../../assets/police.svg")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", 80)
                  .attr("width", 80)

    d3.select("#hud").append("p")
      .attr("id", "main-message")
      .text(() => "Veuillez placer vos pions")
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

}
