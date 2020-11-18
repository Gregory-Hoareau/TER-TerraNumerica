const d3 = require("d3");

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40};
const width = 400;
const height = 400;

var visualizer = d3.select("#visualizer");

var svg = visualizer.append("svg")
    .attr("width", width)
    .attr("height", height);

var points = svg.append("g");

const points_data = [
    {
        x: 150,
        y: 200
    },
    {
        x: 250,
        y: 200
    }
]

points.selectAll("points")
    .data(points_data)
    .join("circle")
        .attr("r", 5)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

var pawns = svg.append("g");

const pawns_data = [
    {
        x: 100,
        y: 100,
    }
]

pawns.selectAll("pawns")
    .data(pawns_data)
    .join("circle")
        .attr("r", 20)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .style("fill", "gainsboro")
        .style("fill-opacity", 0.3)
        .style("stroke", "silver")
        .style("stroke-width", 5)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

function dragstarted(event, d) {
    console.log("sart");
}

function dragged(event, d) {
    console.log("drag");
    console.log(typeof(this));
    d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
}

function dragended(event, d) {
    console.log("end");
    let distance = 10;
    var magnetizedPoint = {
        x: 10,
        y: 10
    };
    for (const p of points_data) {
        let d = Math.hypot(event.x - p.x, event.y - p.y);
        if (d < distance) {
            magnetizedPoint = p;
        }
    }
    d3.select(this).attr("cx", d.x = magnetizedPoint.x).attr("cy", d.y = magnetizedPoint.y);
}