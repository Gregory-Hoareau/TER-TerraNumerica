import {Graph} from "./Graph";
import { Game } from "./Game";
const d3 = require("d3");


// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40};
const width = window.innerWidth - margin.left - margin.right;
const height = window.innerHeight - margin.top - margin.bottom;

const originalColor = "#69b3a2"
const clickedOnColor = "rgb(0,0,255)"
const nearColor = "rgb(255,0,0)"
const copsColor = "rgb(0,53,136)"
const thiefColor = "rgb(125,125,125)"

// append the svg object to the body of the page
let svg = d3.select("#visualizer")
    .append("svg")
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
    const circles = document.getElementsByClassName("circle");
    for(const c of circles) {
        c.style.fill = originalColor
    }

    const clicked =  event.target;
    console.log(clicked)
    let edges;
    for(let i=0; i<circles.length; i++) {
        if(clicked === circles.item(i)) {
            edges = graph.edges({id: i});
        }
    }
    //console.log(clicked.__data__);
    clicked.style.fill = clickedOnColor;
    for(const e of edges) {
        circles.item(e.id).style.fill = nearColor;
    }
}

function initNodes(n) {
    for(let i=0; i<n; i++) {
        nodes.push({id: i});
    }
    nodes.push({id: n});
    
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
    console.log(links)
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
var simulation = d3.forceSimulation(nodes)             // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
        .id(function(d) { return d.id; })                     // This provide  the id of a node
        .links(links)                                    // and this the list of links
    )
    .force("charge", d3.forceManyBody().strength(-100))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    .on("end", ticked);

// This function is run at each iteration of the force algorithm, updating the nodes position.
function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function (d) { return d.x+6; })
        .attr("cy", function(d) { return d.y-6; });
}
radius = 32

const circles = d3.range(2).map(i => ({
  x: Math.random() * (width - radius * 2) + radius,
  y: Math.random() * (height - radius * 2) + radius,
}));
svg.selectAll("pasteque")
  .data(circles)
  .join("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", radius)
  .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  function dragstarted(event, d) {
  d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
  d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
}

function dragended(event, d) {
  d3.select(this).attr("stroke", null);
}



// d3.select("body").append("span")
//     .text("Hello, world!");

