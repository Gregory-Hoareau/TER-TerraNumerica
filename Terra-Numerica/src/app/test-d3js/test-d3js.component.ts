import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { GraphService } from '../_services/graph/graph.service';
import { Graph } from '../_services/graph/Graph';
import { Pawns } from '../models/Pawn/pawn';
import { Thief } from '../models/Pawn/Thief/thief';
import { Cops } from '../models/Pawn/Cops/cops';

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



  constructor(private graphService: GraphService) {
    
  }

  ngOnInit(): void {
    console.log(document.getElementById('visualizer'))
    this.width = document.getElementById('visualizer').offsetWidth;
    this.height = document.getElementById('visualizer').offsetHeight;
    this.grid.init(4,4,this.width,this.height);
    console.log(this.width)
    console.log(this.height)
    this.svg = d3.select("#visualizer")
    .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");



    this.graphService.initGraph('grid', [4, 4])
    this.nodes = this.graphService.getNodes();
    this.links = this.graphService.getLinks();

    this.init()
  }

  init() {
    this.initData();
    this.simulation = d3.forceSimulation(this.nodes)
          .force("link", d3.forceLink()
          .links(this.links)
        )
        .force("distance", () => 1)
        .force("center", d3.forceCenter(this.width / 2, this.height / 2))
        .force("charge", d3.forceManyBody().strength(-100))
        .on("tick", this.ticked.bind(this));

    for(let i = 0; i<2; i++){
      this.cops.push(new Cops(this.graphService, 50, 250 + i*100, i));
    }
    this.thiefs.push(new Thief(this.graphService, 50, 150));

    this.svg.append("text")
      .attr("x", this.width/2 - 200)
      .attr("y", 50)
      .attr("width", 200)
      .text( function (d) { return "c'est au tour du policier"; })
      .attr("font-family", "sans-serif")
      .attr("font-size", "40px")
      .attr("fill", "red");
  }

  initData() {
    this.link = this.svg
    .selectAll("line")
    .data(this.links)
    .enter()
    .append("line")
        .style("stroke", "#aaa")

    // Initialize the nodes
    this.node = this.svg
        .selectAll("circle")
        .data(this.nodes)
        .enter()
        .append("circle")
            .attr("r", 20)
            .attr("class", "circle")
            .style("fill", "#69b3a2")
            //.on("click", this.showPossibleMoves.bind(this))
  }

  /* replay() {
    location.reload();
  } */

  /* checkEnd(){
    if (this.pawn[0].x == this.pawn[1].x){
      if (this.pawn[0].y == this.pawn[1].y){
        this.svg.append("text")
          .attr("x", this.width/2 - 175)
          .attr("y", this.height - 75)
          .attr("width", 200)
          .text( function (d) { return "Le policier a gagné !"; })
          .attr("font-family", "sans-serif")
          .attr("font-size", "40px")
          .attr("fill", "blue");
        this.svg.append("text")
          .attr("x", this.width/2 - 75)
          .attr("y", this.height - 25)
          .attr("width", 50)
          .text( function (d) { return "Rejouer"; })
          .attr("font-family", "sans-serif")
          .attr("font-size", "50px")
          .on("click", this.replay);
      }
    }
  } */
  private grid = {
    cells: [],
    GRID_SIZE: 100,
    init: function(long = null, lar = null, width, height) {
      this.cells = [];

      if (long != null && lar != null) {
        var id = 0;
        for(var i = 0 ; i < long ; ++i) {
          for(var j = 0 ; j < lar ; ++j) {
            this.cells.push({
              id: id,
              x: i * width/long + (width/long)/2,
              y: j * height/lar + (height/lar)/2,
              occupied: false
            });
            id++;
          }
        }
      } else {
        for(var i = 0 ; i < width / this.GRID_SIZE ; ++i) {
          for(var j = 0 ; j < height / this.GRID_SIZE ; ++j) {
            var cell;
            cell = {
              x: i * this.GRID_SIZE,
              y: j * this.GRID_SIZE,
              occupied: false
            };
            this.cells.push(cell);
          }
        }
      }
      console.log(this.cells)
    },

    sqdist: function (a, b) {
      return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    },

    getCell: function (d) {
      return this.cells[d.index];
    },
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

}
