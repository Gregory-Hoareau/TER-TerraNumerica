import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';
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

  private cops_position_slot = [];

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

  updateCopsPositions(positions) {
    this.cops_position_slot = positions;
  }

  setThiefSpeed(speed: number) {
    this.thiefSpeed = speed;
  }

  drawGraph(svg) {
    this.graph.draw(svg);
  }

  stop() {
    this.graph.stop();
  }

  movingPermission(permission: boolean) {
    this.graph.setAllowedToMove(permission)
  }

  moveNode(node, endPosition) {
    this.graph.moveNode(node, endPosition);
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

  private neighbors(index, links = []) {
    const result = [];
    for(let i = 0; i < links.length; i++) {
      if(links[i].source === index) {
        result.push(links[i].target);
      } else if (links[i].target === index) {
        result.push(links[i].source);
      }
    }
    return result;
  }

  private subset(set = []) {
    const tmp_set = [...set]
    const subset = [];
    const size = this.randomInRange(1, tmp_set.length);
    for(let i = 0; i < size; i++) {
      const index = this.randomInRange(0, tmp_set.length);
      const element = tmp_set.splice(index, 1)[0];
      subset.push(element);
    }
    return subset;
  }

  // Generate a random number between "start" (include) and "end" (exclude)
  private randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start) + start);
  }

  private oneCopsGraph(n): Common {
    let nodes = this.generatesNodes(n)
    let links = [];

    for(let i=n-2; i>=0; i--) {
      let index = this.randomInRange(i, n);
      while(index === i) { // Check if random selected node is not the current node
        index = this.randomInRange(i, n);
      }
      const neighbors = this.neighbors(index, links);
      const neighbors_subset = this.subset(neighbors);
      for(const neighbor of neighbors_subset) {
        if(neighbor !== i) {
          links.push({source: i, target: neighbor})
        }
      }
      links.push({source: i, target: index});
    }
    return new Common(nodes, links, 'copsAlwaysWin');
  }

  private async generatePetersen() {
    const blob = await this.downloadAssets('petersen');
    const file = new File([blob], 'petersen.json');
    /* console.log('FILE',file); */
    await this.loadGraphFromFile(file);
    /* console.log('HERE'); */
  }

  private async generateDodecahedron() {
    const blob = await this.downloadAssets('dodecahedron');
    const file = new File([blob], 'dodecahedron.json');
    /* console.log('FILE',file); */
    await this.loadGraphFromFile(file);
    /* console.log('HERE'); */
  }

  private downloadAssets(name: string): Promise<Blob> {
    return new Promise((resolve) => {
      this.http.get(`assets/${name}.json`, {responseType: 'blob'}).subscribe(data => {
        /* console.log(data) */
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
    /* console.log('THERE'); */
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
    const edges = this.graph.edges(vertex.__data__, speed, this.cops_position_slot);
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
    const edges = this.graph.edges(vertex.__data__, speed, this.cops_position_slot)
    edges.push(vertex.__data__)
    d3.selectAll(".circle").style("fill", '#69b3a2');
    if(this.gameMode === "easy" || this.gameMode === "medium") {
      d3.selectAll(".circle").filter(function(d: any) {
        return edges.some(n => n.index === d.index);
      }).style("fill", "orange");
      vertex.style.fill = "#05B800"
      lastPos.style.fill = "blue"

    }

    return edges;
  }

  showCopsPossibleMoves(cops, show) {
    /* console.log('COPS', cops) */
    const edges = this.graph.edges(cops)
    edges.push(cops)
    if(this.gameMode === "easy" || this.gameMode === "medium") {
      if(show){
        d3.selectAll(".circle").filter(function(d: any) {
          return edges.some(n => n.index === d.index);
        }).style("fill", "red");
      }else{
        d3.selectAll(".circle").filter(function(d: any) {
          return edges.some(n => n.index === d.index);
        }).style("fill", '#69b3a2');
        /* this.pawnsToForeground(); */
      }
    }

    return edges;
  }

  pawnsToForeground() {
    d3.selectAll('.pawns').raise();
  }

}
