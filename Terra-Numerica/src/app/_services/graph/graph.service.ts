import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { Common } from 'src/app/models/Graph/Common/common';
import { Cycle } from 'src/app/models/Graph/Cycle/cycle';
import { Graph } from 'src/app/models/Graph/graph';
import { Grid } from 'src/app/models/Graph/Grid/grid';
import { Tore } from 'src/app/models/Graph/Grid/Tore/tore';
import { Specific } from 'src/app/models/Graph/specific/specific';
import { Tree } from 'src/app/models/Graph/Tree/tree';
import { RandomGraphService } from '../random-graph/random-graph.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  
  private graph: Graph;

  private gameMode: string;

  private inputFile: File;

  private thiefSpeed: number = 1;

  constructor(private randomGraph: RandomGraphService, private router: Router, private http: HttpClient) {
    if (localStorage.getItem("method") !== null) {
      switch(localStorage.getItem("method")) {
        case "generate":
          if (localStorage.getItem("type") !== null && localStorage.getItem("args") !== null) {
            const type = localStorage.getItem("type");
            const args = JSON.parse(localStorage.getItem("args"));
            if(router.url.includes('board')) {
              this.generateGraph(type, args)
            }
          }
          break;
        case "import":
          if (localStorage.getItem("config") !== null) {
            const config = JSON.parse(localStorage.getItem("config"))
            this.importGraph(config);
          }
          break;
      }
    } else {
      this.graph = null;
    }
  }

  setThiefSpeed(speed: number) {
    this.thiefSpeed = speed;
  }

  drawGraph(svg) {
    this.graph.draw(svg);
  }

  async generateGraph(type: string, args?: any[]) {
    localStorage.setItem("method", "generate");
    localStorage.setItem("type", type);
    localStorage.setItem("args", JSON.stringify(args));
    this.graph = null

    switch(type) {
      case 'grid':
        this.graph = this.generateGrid(args[0], args[1]);
        break;
      case 'tore':
        this.graph = this.generateTore(args[0], args[1]);
        break;
      case 'cycle':
        this. graph = this.generateCycle(args[0]);
        break;
      case 'tree':
        this.graph = this.generateTree(args[0], args[1]);
        break;
      case 'random':
        this.graph = this.generateRandom();
        break;
      case 'copsAlwaysWin':
        this.graph = this.oneCopsGraph(args[0]);
        break;
      case 'petersen':
        await this.generatePetersen()
        break;
      case 'dodecahedron':
        await this.generateDodecahedron()
        break;
    }
  
  }

  getGraph() {
    return this.graph;
  }

  generatesNodes(n: number): any[] {
    let nodes = [];
    for(let i=0 ; i < n ; ++i) {
      nodes.push({
        index: i,
      });
    }
    return nodes;
  }

  generateGrid(width: number, height: number): Grid {

    const size = width*height;
    let nodes = this.generatesNodes(size);
    let links = [];

    // LINKS HORIZONTALS
    for (let i = 0 ; i < height*width ; i += width) {
      for (let j = 0 ; j < width-1 ; ++j) {
        links.push({
          source: i+j,
          target: (i+j)+1
        })
      }
    }

    // LINKS VERTICAL
    for (let i = 0 ; i < (height-1)*width ; ++i) {
      links.push({
        source: i,
        target: i+width
      })
    }

    return new Grid(nodes, links, width, height);
  }
  
  generateTore(width: number, height: number) {
    const size = width*height;
    let nodes = this.generatesNodes(size);
    let links = [];

    // LINKS HORIZONTALS
    for (let i = 0 ; i < height*width ; i += width) {
      for (let j = 0 ; j < width-1 ; ++j) {
        links.push({
          source: i+j,
          target: (i+j)+1
        })
      }
    }

    // LINKS VERTICAL
    for (let i = 0 ; i < (height-1)*width ; ++i) {
      links.push({
        source: i,
        target: i+width
      })
    }

    // VERTICAL TORE
    for (let i = 0 ; i < width ; ++i) {
      links.push({
        source: i,
        target: i+((width*height)-width)
      })
    }

    // HORIZONTAL TORE
    for (let i = 0 ; i < height*width ; i += width) {
      links.push({
        source: i,
        target: i+(width-1)
      })
    }

    return new Tore(nodes, links, width, height);
  }

  generateCycle(size: number): Cycle {
    let nodes = this.generatesNodes(size);
    let links = [];

    for(let i: number = 0 ; i < size-1 ; ++i) {
      links.push({
        source: i,
        target: i+1
      })
    }
    links.push({
      source: 0,
      target: size-1
    })

    return new Cycle(nodes, links);
  }

  generateTree(size: number, arity: number): Tree {

    let nodes = this.generatesNodes(size);
    let links = [];

    for(let i = 0 ; i < size ; ++i) {
      for(let j = 1 ; j <= arity && (i*arity)+j < size ; ++j) {
        links.push({
          source: i,
          target: (i*arity) + j
        });
      }
    }

    return new Tree(nodes, links);
  }

  generateRandom(): Common {
    let randomGraph = this.randomGraph.getRandomGraph();

    return new Common(randomGraph.nodes, randomGraph.links)
  }

  private oneCopsGraph(n): Common {
    let nodes = this.generatesNodes(n)
    let links = [];

    let idNode1 = Math.floor(Math.random() * Math.floor(n))
    let node1 = nodes[idNode1];

    //Construct a line graph
    for(let i=0; i<idNode1; i++){
      links.push({source: i, target: i+1});
    }

    const marked = [];
    const times = Math.floor(n / 3)
    for (let k = 0; k < times; k++) {

      idNode1 = Math.floor(Math.random() * Math.floor(n))
      node1 = nodes[idNode1];
      let idNode2 = Math.floor(idNode1 + Math.random() * Math.floor(n - idNode1 - 1))
      let node2 = nodes[idNode2];
      
      if(!marked.includes(node2) && idNode2 !== idNode1) {
        marked.push(node2);
        marked.push(node1)
        for(let i=idNode1 + 1; i<n; i++){
          if(i!=idNode2){
            links.push({source: node1, target: i});
            links.push({source: node2, target: i});
          }
        }
        links.push({source: node1, target: node2})
        idNode1 = Math.floor(Math.random() * Math.floor(n))
        node1 = nodes[idNode1];
      }
    }
    return new Common(nodes, links, 'copsAlwaysWin');
  }

  private async generatePetersen() {
    const blob = await this.downloadAssets('petersen');
    const file = new File([blob], 'petersen.json');
    console.log('FILE',file);
    await this.loadGraphFromFile(file);
    console.log('HERE');
  }

  private async generateDodecahedron() {
    const blob = await this.downloadAssets('dodecahedron');
    const file = new File([blob], 'dodecahedron.json');
    console.log('FILE',file);
    await this.loadGraphFromFile(file);
    console.log('HERE');
  }

  private downloadAssets(name: string): Promise<Blob> {
    return new Promise((resolve) => {
      this.http.get(`/assets/${name}.json`, {responseType: 'blob'}).subscribe(data => {
        resolve(data)
      })
    })
    
  }

  readAsync(file: File): Promise<Graph> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        let config = JSON.parse(reader.result.toString());
        resolve(config);
      };
      reader.onerror = () => {
          reject (new Error ('Unable to read..'));
      };
      reader.readAsText(file);
    });
  }
  
  async loadGraphFromFile(file: File) {
    this.inputFile = file;
    const config = await this.readAsync(file);
    this.importGraph(config);
    console.log('THERE');
  }

  importGraph(config) {
    this.graph = null;
    localStorage.setItem("method", "import");
    localStorage.setItem("config", JSON.stringify(config));
    switch(config.typology) {
      case 'grid':
        this.graph = new Grid(config.nodes, config.links, config.width, config.height);
        break;
      case 'cycle':
        this.graph = new Cycle(config.nodes, config.links);
        break;
      case 'tree':
        this.graph = new Tree(config.nodes, config.links);
        break;
      case 'random':
        this.graph = new Common(config.nodes, config.links);
        break;
      case 'specific':
        this.graph = new Specific(config.nodes, config.links);
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

  setGameMode(gameMode){
    this.gameMode = gameMode
  }

  showPossibleMove(vertex, speed) {
    const edges = this.graph.edges(vertex.__data__, speed);
    edges.push(vertex.__data__)
    d3.selectAll(".circle").style("fill", '#69b3a2');
    if(this.gameMode === "easy" || this.gameMode === "medium") {
      d3.selectAll(".circle").filter(function(d: any) {
        return edges.includes(d);
      }).style("fill", "#05B800");
      vertex.style.fill = "blue"
    }

    return edges;
  }

  showPossibleMoveDragging(vertex, lastPos, speed) {
    const edges = this.graph.edges(vertex.__data__, speed)
    edges.push(vertex.__data__)
    d3.selectAll(".circle").style("fill", '#69b3a2');
    if(this.gameMode === "easy" || this.gameMode === "medium") {
      d3.selectAll(".circle").filter(function(d: any) {
        return edges.includes(d);
      }).style("fill", "orange");
      vertex.style.fill = "#05B800"
      lastPos.style.fill = "blue"

    }

    return edges;
  }

  showCopsPossibleMoves(cops, show) {
    const edges = this.graph.edges(cops.__data__)
    edges.push(cops.__data__)
    if(this.gameMode === "easy" || this.gameMode === "medium") {
      if(show){
        d3.selectAll(".circle").filter(function(d: any) {
          return edges.includes(d);
        }).style("fill", "red");
      }else{
        d3.selectAll(".circle").filter(function(d: any) {
          return edges.includes(d);
        }).style("fill", '#69b3a2');
      }
    }

    return edges;
  }
}
