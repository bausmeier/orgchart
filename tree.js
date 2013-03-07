// Dimensions of the svg
var width = 960,
    height = 800;

var head, // The root of the tree
    i = 0; // Index used for id

// 80 padding on either side
var cluster = d3.layout.cluster().size([height, width - 160]);

var diagonal = d3.svg.diagonal().projection(function(d) {
  // Left to right tree alignment so switch x and y
  return [d.y, d.x];
});

var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(80,0)");

// Fetch the data to build the tree
d3.json("data.json", function(error, root) {
  head = root;
  // Align the root vertically
  root.x0 = height / 2;
  root.y0 = 0;
  // Collapse all children
  root.children.forEach(collapse);
  update(root);
});

d3.select(self.frameElement).style("height", height + "px");

var update = function(source) {
  var nodes = cluster.nodes(head).reverse(),
      links = cluster.links(nodes);

  // Get all nodes and if they don't already have one give them an id
  var node = svg.selectAll(".node").data(nodes, function(d) {
    return d.id || (d.id = ++i);
  });

  var link = svg.selectAll(".link").data(links, function(d) {
    return d.target.id;
  });

  // When a new link is added put it at the source and point it to the source (no length)
  var linkEnter =  link.enter().append("path").attr("class", "link").attr("d", function(d) {
    var o = {
      x: source.x0,
      y: source.y0
    };
    return diagonal({
      source: o,
      target: o
    });
  });

  // Transistion each link to point from source to target
  link
    .transition()
    .duration(750)
    .attr("d", diagonal);

  // When a link is exited transition it to the source and point it to the source (no length)
  link
    .exit()
    .transition()
    .duration(750)
    .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

  // Node enter
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click);
  var w = 160,
      h = 50;
  nodeEnter.append("rect")
      .attr("width", 1e-6)
      .attr("height", 1e-6)
      .style("fill", function(d) {
        // If d has hidden children style it differently
        return d._children ? "lightsteelblue" : "#fff";
      });

  nodeEnter.append("text")
      .attr("dy", -9)
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.name;
      })
      .style("fill-opacity", 1e-6);
  nodeEnter.append("text")
      .attr("dy", 9)
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.position;
      })
      .style("fill-opacity", 1e-6);

  // Node update
  var nodeUpdate = node.transition()
    .duration(750)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });
  nodeUpdate.selectAll("text").style("fill-opacity", 1);
  nodeUpdate.selectAll("rect")
      .attr("width", w)
      .attr("height", h)
      .attr("x", -w / 2)
      .attr("y", -h / 2)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

  // Node exit
  var nodeExit = node.exit().transition()
    .duration(750)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
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

// Make d the new root and show its children
var switchRoot = function(d) {
  if (d !== head && !d._children) {
    // d has no hidden chidren so do nothing
    return;
  }
  if (d === head) {
    // d is the current head of the tree
    if (d.parent) {
      // d has a parent so make it the head of the tree
      head = d.parent;
      hideChildren(d);
    }
    return;
  }
  // d is not the head of the tree so make it head and show its children
  d.parent = head;
  showChildren(d);
  head = d;
}

// Toggle the visibility of the children of d
var toggleChildren = function(d) {
  if (d.children) {
    hideChildren(d);
  } else {
    showChildren(d);
  }
}

// Show the children of d
var showChildren = function(d) {
  d.children = d._children;
  d._children = null;
}

// Hide the children of d
var hideChildren = function(d) {
  d._children = d.children;
  d.children = null;
}

// Recursively collapse starting at d
var collapse = function(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}
