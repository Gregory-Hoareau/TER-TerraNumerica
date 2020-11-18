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

  private svg;
  private link;
  private node;
  private graph: Graph;
  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;
  private nodes: SimulationNodeDatum[] = []
  private links: SimulationLinkDatum<SimulationNodeDatum>[] = []

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
