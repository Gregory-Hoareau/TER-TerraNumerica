import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { GraphService } from '../_services/graph/graph.service';
import { Graph } from '../_services/graph/Graph';
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
  private margin = {top: 10, right: 30, bottom: 30, left: 40};
  private width;
  private height;
  

  private svg; private link; private node; 
  private thiefs: Thief[] = [];
  private cops: Cops[] = [];
  private settedPosition; private lastPosX; private lastPosY;
  private graph: Graph;
  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;
  private nodes: SimulationNodeDatum[] = []
  private links: SimulationLinkDatum<SimulationNodeDatum>[] = []

  private grid;

  //Params coming from the menu
  private graphType;
  private copsNum;
  private graphParams;
  private gameMode;

  constructor(private graphService: GraphService, private gameManager: GameService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.graphType = params['graphType'];
      this.copsNum = +params['copsNum'];
      this.gameMode = params['gameMode'];
      this.graphParams = this.convertAsNumberArr(params['graphParams']);
    })
    this.width = document.getElementById('visualizer').offsetWidth;
    this.height = document.getElementById('visualizer').offsetHeight;
    this.svg = d3.select("#visualizer")
                .append("svg")
                    .attr("width", this.width)
                    .attr("height", this.height)

    this.graphService.initGraph(this.graphType, this.graphParams)
    this.grid = this.graphService.getGrid();
    this.nodes = this.graphService.getNodes();
    this.links = this.graphService.getLinks();

    this.init();
  }

  private convertAsNumberArr(arr) {
    let res = [];
    res[0] = +arr[0];
    res[1] = +arr[1]
    return res;
  }

  getPoolRadius() {
    if (this.width < this.height) {
      return (this.width/2)-50;
    } else {
      return (this.height/2)-50;
    }
  }

  init() {
    console.log("GAME MODE : " + this.gameMode)
    this.initData();

    // var pool = this.svg.append("circle")
    //   .style('opacity', 0.1)
    //   .attr("r", this.getPoolRadius())
    //   .attr("cy", this.height / 2)
    //   .attr("cx", this.width / 2)

    this.simulation = d3.forceSimulation(this.nodes)
          .force("link", d3.forceLink()
            .links(this.links)
          )
          .force("radial", d3.forceRadial(this.getPoolRadius(), this.width / 2, this.height / 2))
          .force("center", d3.forceCenter(this.width / 2, this.height / 2))
          .force("charge", d3.forceManyBody().strength(-400))
          .on("tick", this.ticked.bind(this));

    for(let i = 0; i<this.copsNum; i++){
      this.cops.push(new Cops(this.gameManager, this.graphService, 50, 300, i));
    }
    this.thiefs.push(new Thief(this.gameManager, this.graphService, 50, 150));
    this.gameManager.setGameMode(this.gameMode);
    this.graphService.setGameMode(this.gameMode)
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

  initData() {
    // Initialize the nodes
    this.node = this.svg
      .selectAll("circle")
      .data(this.nodes)
      .enter()
      .append("circle")
          .attr("r", 20)
          .attr("class", "circle")
          .style("fill", "#69b3a2")

    this.link = this.svg
      .selectAll("line")
      .data(this.links)
      .enter()
      .append("line")
          .style("stroke", "#aaa")
  }

  private ticked() {
    
    this.link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    this.node
      .each( (d) => {
        let gridpoint = this.grid.getCell(d);
        if (gridpoint) {
          d.x += (gridpoint.x - d.x);
          d.y += (gridpoint.y - d.y);
        }
      })
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }

  showPossibleMoves(event){
    return this.graphService.showPossibleMove(event);
  }

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
