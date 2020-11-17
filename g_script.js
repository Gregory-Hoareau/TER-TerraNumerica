//add listener



//d3js
var width = 640, height = 480;

var nodes = [
    { x:   width/3, y: height/2 },      //0
    { x: 3*width/3, y: height/2 },      //1
    { x: 2*width/3, y: height/2 },      //2
    { x: width/3, y: 2*height/2 },      //3
    { x: 2*width/3, y: 2*height/2 },    //4
    { x: 3*width/3, y: 2*height/2 },    //5
];

var links = [
    { source: 0, target: 1 },
    { source: 0, target: 5 }
];

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var force = d3.layout.force()
    .size([width, height])
    .nodes(nodes)
    .links(links);

force.linkDistance(width/2);

var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');


var node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .on("click", testClick);

force.on('end', function() {

    node.attr('r', width/25)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

});

force.start();

function testClick(event) {
    console.log("Click on circle is working")
    console.log(event)
}

function addPoint() {
    console.log('button click');
    nodes.push({ x: 5*width/3, y: 5000*height });
}