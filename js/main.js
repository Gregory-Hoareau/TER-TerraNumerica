import {Graph} from "./Graph";
const d3 = require("d3");


// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40};
// const width = window.innerWidth - margin.left - margin.right;
// const height = window.innerHeight - margin.top - margin.bottom;
var width = document.getElementById('visualizer').offsetWidth;
var height = document.getElementById('visualizer').offsetHeight;

const copsW = document.getElementById("copsWin")
copsW.hidden = true;
const replayBtn = document.getElementById("replayBtn")
replayBtn.addEventListener("click", replay)
const originalColor = "#69b3a2"
const clickedOnColor = "rgb(0,0,255)"
const nearColor = "rgb(255,0,0)"
const copsColor = "rgb(0,53,136)"
const thiefColor = "rgb(125,125,125)"

// append the svg object to the body of the page
let svg = d3.select("#visualizer")
    .append("svg")
      // .attr("viewBox", '0 0' + widh + ' ' + height)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let nodes = [];
let links = [];

function clearGraph() {
    nodes = [];
    links = [];
}

function visualiseMove(graph) {
    //console.log(event);
    //reset graph's nodes color to orignal
    const clicked =  event.target;
    console.log(clicked)
    showPossibleMoves(clicked, graph)
}

function showPossibleMoves(event, graph){
  const circles = document.getElementsByClassName("circle");
  for(const c of circles) {
    c.style.fill = originalColor
  }
  let edges;
  for(let i=0; i<circles.length; i++) {
    if(event === circles.item(i)) {
      edges = graph.edges({id: i});
    }
  }
  //console.log(clicked.__data__);
  event.style.fill = clickedOnColor;
  for(const e of edges) {
    circles.item(e.id).style.fill = nearColor;
  }

  return edges;
}

function initNodes(n) {
    for(let i=0; i<n; i++) {
        nodes.push({id: i});
    }
}

function cycleGenerator(n) {
    clearGraph()
    initNodes(n);

    for(let i=0; i<n-1; i++) {
        links.push({source:i, target: i+1})
    }
    links.push({source: n-1, target: 0})
}

function gridGenerator(long, lar) {
    clearGraph()
    const n = long*lar;
    initNodes(n)

    //construct grid links
    let count = 0;
    for(let i=0; i<lar; i++) {
        for(let j=0; j<long-1; j++) {
            links.push({source: count, target: count+1})
            count++;
        }
        count++
    }

    for(let i=0; i<lar-1; i++) {
        for(let j=0; j<long; j++) {
            links.push({source: (long*i)+j, target: (long*i)+j+long});
        }
    }
    console.log(nodes)
}

const toGenerate = "grid";
switch(toGenerate) {
    case "cycle":
        cycleGenerator(5)
        break;
    case "grid":
        gridGenerator(4,4)
        break;
    default:
        break;
}

const GRID_SIZE = 100;
let grid = {
  cells: [],

  init: function(long = null, lar = null) {
    this.cells = [];

    if (long != null && lar != null) {
      var id = 0;
      for(var i = 0 ; i < long ; ++i) {
        for(var j = 0 ; j < lar ; ++j) {
          this.cells.push({
            id: id,
            x: i * width/long,
            y: j * height/lar,
            occupied: false
          });
          id++;
        }
      }
    } else {
      for(var i = 0 ; i < width / GRID_SIZE ; ++i) {
        for(var j = 0 ; j < height / GRID_SIZE ; ++j) {
          var cell;
          cell = {
            x: i * GRID_SIZE,
            y: j * GRID_SIZE,
            occupied: false
          };
          this.cells.push(cell);
        }
      }
    }
  },

  sqdist: function(a,b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  },

  getCell: function(d) {
    // console.log(d.id);
    return this.cells[d.id];
  },

  occupyNearest: function(p) {
    var minDist = 1000000;
    var d;
    var candidate = null;
    for (var i = 0 ; i < this.cells.length ; ++i) {
      if (!this.cells[i].occupied && ( d = this.sqdist(p, this.cells[i])) < minDist) {
        minDist = d;
        candidate = this.cells[i];
      }
    }
    if(candidate) {
      candidate.occupied = true;
    }
    return candidate;
  }
}
grid.init(4,4);
console.log(grid.cells);

const g = new Graph(nodes, links);

// Initialize the links
var link = svg
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
        .style("stroke", "#aaa")

// Initialize the nodes
var node = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
        .attr("r", 20)
        .attr("class", "circle")
        .attr("draggable", true)
        .style("fill", originalColor)
        .on("click", visualiseMove.bind(this, g))

// Let's list the force we wanna apply on the network
var simulation = d3.forceSimulation(nodes)                      // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
        .id(function(d) { return d.id; })                       // This provide  the id of a node
        .links(links)                                          // and this the list of links
    )
    // .force("charge", d3.forceManyBody().strength(-100))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    .force("distance", () => 1)
    .on("tick", ticked);

// This function is run at each iteration of the force algorithm, updating the nodes position.
function ticked() {
    grid.init(4,4);
    node
      .each( (d) => {
        let gridpoint = grid.getCell(d);
        if (gridpoint) {
          d.x += (gridpoint.x - d.x) * 0.5;
          d.y += (gridpoint.y - d.y) * 0.5;
        }
      })
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
}

let pawn = d3.range(2).map(i => ({
  x: 100,
  y: 100 + 100*i,
  firstMove: true,
  possiblePoints: [],
  lastSlot: [],

}));

const radius = 20;
const detectRadius = 25;
svg.selectAll("pawn")
  .data(pawn)
  .join("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", radius)
  .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

var lastPosX;
var lastPosY;
var settedPosition = true;
  function dragstarted(event, d) {
    lastPosX = event.x
    lastPosY = event.y
    settedPosition = false;
    if(!d.firstMove) {
      showPossibleMoves(d.lastSlot, g)
    }
    d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
  d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
}

function checkEnd(){
  if (pawn[0].x == pawn[1].x){
    if (pawn[0].y == pawn[1].y){
      copsW.hidden = false;
    }
  }
}

function dragended(event, d) {
  d3.select(this).attr("stroke", null);
  let circles = document.getElementsByClassName("circle");
  if(d.firstMove == true) {
    for (const c of circles) {
      if (c.cx.baseVal.value - detectRadius <= event.x && event.x <= c.cx.baseVal.value + detectRadius) {
        if (c.cy.baseVal.value - detectRadius <= event.y && event.y <= c.cy.baseVal.value + detectRadius) {
          d.possiblePoints = showPossibleMoves(c, g)
          console.log(d.possiblePoints)
          d.lastSlot = c;
          d3.select(this).attr("cx", d.x = c.cx.baseVal.value).attr("cy", d.y = c.cy.baseVal.value);
          settedPosition = true;
          d.firstMove = false;
          break;
        }
      }
    }
    if (settedPosition == false) {
      d3.select(this).attr("cx", d.x = lastPosX).attr("cy", d.y = lastPosY);
    }
  }else if(d.firstMove == false){
    for(const e of d.possiblePoints) {
      let pos = circles.item(e.id);
      if (pos.cx.baseVal.value - detectRadius <= event.x && event.x <= pos.cx.baseVal.value + detectRadius) {
        if (pos.cy.baseVal.value - detectRadius <= event.y && event.y <= pos.cy.baseVal.value + detectRadius) {
          d.possiblePoints = showPossibleMoves(pos, g)
          d.lastSlot = pos;
          d3.select(this).attr("cx", d.x = pos.cx.baseVal.value).attr("cy", d.y = pos.cy.baseVal.value);
          settedPosition = true;
          break;
        }
      }
    }
    if (settedPosition == false) {
      d3.select(this).attr("cx", d.x = lastPosX).attr("cy", d.y = lastPosY);
    }
  }
  checkEnd();
}

function replay() {
    document.location.reload(true);
}


// d3.select("body").append("span")
//     .text("Hello, world!");

