const d3 = require("d3");

var svg = d3.select("svg");
svg.append("use")
  .attr("href", "#pointer")
  .attr("x", 50)
  .attr("y", 50)
  .attr("fill", "#039BE5")
  .attr("stroke", "#039BE5")
  .attr("stroke-width", "1px");

var dragHandler = d3.drag()
  .on("drag", function () {
    d3.select(this)
      .attr("x", d3.event.x)
      .attr("y", d3.event.y);
  });

dragHandler(svg.selectAll("use"));
