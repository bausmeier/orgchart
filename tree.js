var width = 960,
    height = 800;

var topDog,
    i = 0;

var cluster = d3.layout.cluster()
    .size([height, width - 160]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(80,0)");

d3.json("data.json", function(error, root) {
  topDog = root;
  root.x0 = height / 2;
  root.y0 = 0;
  var collapse = function(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }
  root.children.forEach(collapse);
  update(root);
});

d3.select(self.frameElement).style("height", height + "px");

var update = function(source) {
  var nodes = cluster.nodes(topDog).reverse(),
      links = cluster.links(nodes);
  var node = svg.selectAll(".node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var link = svg.selectAll(".link")
      .data(links, function(d) { return d.target.id; });
  var linkEnter =  link.enter().append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });
  link.transition().duration(750)
      .attr("d", diagonal);
  link.exit().transition()
      .duration(750)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();
  // Node enter
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);
  var w = 160,
      h = 50;
  nodeEnter.append("rect")
      .attr("width", 1e-6)
      .attr("height", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      .attr("dy", -9)
      .style("text-anchor", "middle")
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);
  nodeEnter.append("text")
      .attr("dy", 9)
      .style("text-anchor", "middle")
      .text(function(d) { return d.position; })
      .style("fill-opacity", 1e-6);

  // Node update
  var nodeUpdate = node.transition()
    .duration(750)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  nodeUpdate.selectAll("text").style("fill-opacity", 1);
  nodeUpdate.selectAll("rect")
      .attr("width", w)
      .attr("height", h)
      .attr("x", -w / 2)
      .attr("y", -h / 2)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  // Node exit
  var nodeExit = node.exit().transition()
    .duration(750)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();
  nodeExit.selectAll("text").style("fill-opacity", 1e-6);
  nodeExit.selectAll("rect")
      .attr("width", 1e-6)
      .attr("height", 1e-6)
      .attr("x", 0)
      .attr("y", 0);


  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

var click = function(d) {
  switchRoot(d);
  //toggleChildren(d);
  update(d);
}

var switchRoot = function(d) {
  if (d !== topDog && !d._children) {
    return;
  }
  if (d === topDog) {
    if (d.parent) {
      topDog = d.parent;
      d._children = d.children;
      d.children = null;
    }
    return;
  }
  d.parent = topDog;
  d.children = d._children;
  d._children = null;
  topDog = d;
}

var toggleChildren = function(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}
