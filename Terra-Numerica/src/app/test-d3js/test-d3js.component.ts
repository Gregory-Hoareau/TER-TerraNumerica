import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { D3Node } from 'src/models/node';
import { GraphService } from '../_services/graph/graph.service';
import { Graph } from '../_services/graph/Graph';

@Component({
  selector: 'app-test-d3js',
  templateUrl: './test-d3js.component.html',
  styleUrls: ['./test-d3js.component.scss']
})
export class TestD3jsComponent implements OnInit {
  private margin = {top: 10, right: 30, bottom: 30, left: 40};
  private width = window.innerWidth - this.margin.left - this.margin.right;
  private height = window.innerHeight - this.margin.top - this.margin.bottom;

  private svg; private link; private node; private pawn;
  private settedPosition; private lastPosX; private lastPosY;
  private graph: Graph;
  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;
  private nodes: SimulationNodeDatum[] = []
  private links: SimulationLinkDatum<SimulationNodeDatum>[] = []
  
  private radius = 20;
  private detectRadius = 25;

  constructor(private graphService: GraphService) {
  }

  ngOnInit(): void {
    this.svg = d3.select(".visualizer")
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
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(this.width / 2, this.height / 2))
        .on("end", this.ticked.bind(this));

    this.pawn = d3.range(2).map(i => ({
      x: 100,
      y: 100 + 100*i,
      firstMove: true,
      possiblePoints: [],
      lastSlot: [],
    
    }));
    this.svg.selectAll("pawn")
      .data(this.pawn)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", this.radius)
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
      .call(d3.drag()
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended));

    var lastPosX;
    var lastPosY;
    var settedPosition = true;
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
            .on("click", this.showPossibleMoves.bind(this))
  }

  dragstarted(event, d) {
    this.lastPosX = event.x
    this.lastPosY = event.y
    this.settedPosition = false;
    if(!d.firstMove) {
      this.graphService.showPossibleMove(d.lastSlot)
    }
    d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
  }

  dragged(event, d) {
    d3.select(event.sourceEvent.target).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
  }

  dragended(event, d) {
    console.log("BEGIN ON DRAG ENDED")
    d3.select(event.sourceEvent.target).attr("stroke", null);
    let circles = d3.selectAll(".circle").nodes();
    if(d.firstMove == true) {
      for (let i=0; i<circles.length; i++) {
        const c = circles[i] as any;
        if (c.cx.baseVal.value - this.detectRadius <= event.x && event.x <= c.cx.baseVal.value + this.detectRadius) {
          if (c.cy.baseVal.value - this.detectRadius <= event.y && event.y <= c.cy.baseVal.value + this.detectRadius) {
            d.possiblePoints = this.graphService.showPossibleMove(c)
            console.log(d.possiblePoints)
            d.lastSlot = c;
            d3.select(event.sourceEvent.target).attr("cx", d.x = c.cx.baseVal.value).attr("cy", d.y = c.cy.baseVal.value);
            this.settedPosition = true;
            d.firstMove = false;
            break;
          }
        }
      }
      if (this.settedPosition == false) {
        d3.select(event.sourceEvent.target).attr("cx", d.x = this.lastPosX).attr("cy", d.y = this.lastPosY);
      }
    }else if(d.firstMove == false){
      for(const e of d.possiblePoints) {
        let pos = circles[e.id] as any;
        if (pos.cx.baseVal.value - this.detectRadius <= event.x && event.x <= pos.cx.baseVal.value + this.detectRadius) {
          if (pos.cy.baseVal.value - this.detectRadius <= event.y && event.y <= pos.cy.baseVal.value + this.detectRadius) {
            d.possiblePoints = this.showPossibleMoves(pos)
            d.lastSlot = pos;
            d3.select(event.sourceEvent.target).attr("cx", d.x = pos.cx.baseVal.value).attr("cy", d.y = pos.cy.baseVal.value);
            this.settedPosition = true;
            break;
          }
        }
      }
      if (this.settedPosition == false) {
        d3.select(event.sourceEvent.target).attr("cx", d.x = this.lastPosX).attr("cy", d.y = this.lastPosY);
      }
    }
    console.log("END ON DRAG ENDED")
    //checkEnd();
  }

  checkEnd(){
    if (this.pawn[0].x == this.pawn[1].x){
      if (this.pawn[0].y == this.pawn[1].y){
        //copsW.hidden = false;
        console.log("FIN DE PARTIE")
      }
    }
  }

  private ticked() {

    this.link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    this.node
      .attr("cx", function (d) { return d.x+6; })
      .attr("cy", function(d) { return d.y-6; });
  }

  showPossibleMoves(event){
    return this.graphService.showPossibleMove(event.target);
  }

}
