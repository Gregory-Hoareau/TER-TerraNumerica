import { Injectable } from '@angular/core';
import { GRID } from 'src/app/models/Grid/grid';
import { RandomGraphService } from '../random-graph/random-graph.service';
import { Graph } from './Graph';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private gameMode;
  private graph: Graph;
  private grid = GRID;

  constructor(private randomGraph: RandomGraphService) {
  }

  initGraph(type: string, args?: any[]) {
    this.graph = new Graph([], []);
    switch(type) {
      case 'grid':
        const w = document.getElementById('visualizer').offsetWidth;
        const h = document.getElementById('visualizer').offsetHeight;
        this.grid.init(args[0], args[1], w, h);
        this.gridGenerator(args[0], args[1])
        break;
      case 'cycle':
        this.grid.cells = [];
        this.cycleGenerator(args[0]);
        break;
      case 'tree':
        this.grid.cells = [];
        this.treeGenerator(args[0], args[1])
        break;
      case 'copsAlwaysWin':
        this.grid.cells = [];
        this.oneCopsGraph(args[0])
        break;
      case 'random':
        this.grid.cells = [];
        this.randomGenerator();
    }
  }

  getGrid() {
    return this.grid;
  }

  getNodes() {
    return this.graph.nodes;
  }

  getLinks() {
    return this.graph.links;
  }

  edges(node) {
    return this.graph.edges(node);
  }

  distance(n1, n2) {
    return this.graph.distance(n1, n2);
  }

  showPossibleMove(vertex) {
    const circles = document.getElementsByClassName("circle");
    for(let i=0; i<circles.length; i++) {
      let c = circles[i];
      (c as HTMLElement).style.fill = '#69b3a2'
    }
    let edges;
    for(let i=0; i<circles.length; i++) {
      if(vertex === circles.item(i)) {
        edges = this.edges({index: i});
      }
    }
    if(this.gameMode === "facile" || this.gameMode === "normal"){
      console.log(vertex);
      for(let i=0; i<edges.length; i++) {
        (circles.item(edges[i].index) as HTMLElement).style.fill = "rgb(255,0,0)";
      }
      vertex.style.fill = "rgb(0,0,255)";
    }
    return edges;
  }

  private clearGraph() {
    this.graph.nodes = [];
    this.graph.links = [];
  }

  setGameMode(gameMode){
    this.gameMode = gameMode
  }

  private initNodes(n) {
    for(let i=0; i<n; i++) {
        this.graph.nodes.push({x: i, y: i});
    }
  }

  private gridGenerator(long, lar) {
    this.clearGraph()
    const n = long*lar;
    this.initNodes(n)

    //construct grid links
    let count = 0;
    for(let i=0; i<lar; i++) {
        for(let j=0; j<long-1; j++) {
            this.graph.links.push({source: count, target: count+1})
            count++;
        }
        count++
    }

    for(let i=0; i<lar-1; i++) {
        for(let j=0; j<long; j++) {
            this.graph.links.push({source: (long*i)+j, target: (long*i)+j+long});
        }
    }
  }

  private cycleGenerator(n) {
    this.clearGraph();
    this.initNodes(n);
    
    for(let i=0; i<n-1; i++) {
      this.graph.links.push({source: i, target: i+1})
    }
    this.graph.links.push({source: 0, target: n-1})
  }

  private treeGenerator(n, arity) {
    this.clearGraph();
    this.initNodes(n);
    for(let i=0; i<n; i++) {
      for(let j=1; j<=arity && (i*arity)+j < n; j++) {
        this.graph.links.push({source: i, target: (i*arity) + j});
      }
    }
  }

  private oneCopsGraph(n) {
    this.clearGraph
    this.initNodes(n)
    let numberOfSpecialNode = Math.floor(1 + Math.random() * Math.floor((n/2)-1));
    for(let i=0; i<n-1; i++){
      this.graph.links.push({source: i, target: i+1});
    }
    console.log(numberOfSpecialNode)
    for(let i=0; i<numberOfSpecialNode; i++){
      let idNode1 = Math.floor(Math.random() * Math.floor(n))
      let node1 = this.graph.nodes[idNode1];
      let node2 = this.graph.nodes[Math.floor(idNode1 + Math.random() * Math.floor(n - idNode1))];
      for(let i=0; i<3; i++){
        let idOfNodeLinkedRandomly = Math.floor(idNode1 + Math.random() * Math.floor(n - idNode1));
        console.log(node1)
        console.log(node2)
        this.graph.links.push({source: node1, target: idOfNodeLinkedRandomly});
        this.graph.links.push({source: node2, target: idOfNodeLinkedRandomly});
      }
      this.graph.links.push({source: node1, target: node2});    
    }

  }

  private randomGenerator(){
    let rGraph = this.randomGraph.getRandomGraph();
    this.clearGraph();
    this.initNodes(rGraph.nodes.length);
    rGraph.links.forEach(l => {
      this.graph.links.push(l)
    });
  }

}
