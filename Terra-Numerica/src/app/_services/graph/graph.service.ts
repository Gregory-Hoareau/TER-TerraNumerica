import { Injectable } from '@angular/core';
import { Graph } from './Graph';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private graph: Graph;

  constructor() {
  }

  initGraph(type: string, args?: any[]) {
    this.graph = new Graph([], []);
    switch(type) {
      case 'grid':
        this.gridGenerator(args[0], args[1])
        break;
    }
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
    console.log(vertex);
    vertex.style.fill = "rgb(0,0,255)";
    for(let i=0; i<edges.length; i++) {
      (circles.item(edges[i].index) as HTMLElement).style.fill = "rgb(255,0,0)";
    }

    return edges;
  }

  private clearGraph() {
    this.graph.nodes = [];
    this.graph.links = [];
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

}
