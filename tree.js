// Dimensions of the svg
var width = 1024,
    height = 768,
    nodeWidth = 250
    nodeHeight = 100;

var head, // The root of the tree
    i = 0; // Index used for ids

// 80 padding on either side
var cluster = d3.layout.cluster()
                .size([height, width - nodeWidth]);

// Creates a method which draws a line between the source and target passed to it
var diagonal = d3.svg.diagonal().projection(function(d) {
  // Left to right tree alignment so switch x and y
  return [d.y, d.x];
});

// Add an svg and a g to body
var svg = d3.select("body")
            .append("svg")
              .attr("width", width)
              .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + nodeWidth / 2 + ", 0)");

// Fetch the data to build the tree
d3.json("data/greg.reis.json", function(error, root) {
  head = root;
  // Align the root vertically
  root.x0 = height / 2;
  root.y0 = 0;
  // Collapse all children
  root.children.forEach(collapse);
  update(root);
});

d3.select(self.frameElement).style("height", height + "px");

// Update the tree starting at head
var update = function(source) {
  var nodes = cluster.nodes(head),
      links = cluster.links(nodes);

  // Get all nodes and if they don't already have one give them an id
  var node = svg.selectAll(".node")
    .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

  var link = svg.selectAll(".link")
    .data(links, function(d) {
      return d.target.id;
    });

  // When a new link is added put it at the source and point it to the source (no length)
  var linkEnter = link.enter()
    .insert("path", ":first-child")
      .attr("class", "link")
      .attr("d", function(d) {
        var source0 = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: source0,
          target: source0
        });
      });

  // Transistion each link to point from source to target
  link.transition()
    .duration(750)
    .attr("d", diagonal);

  // When a link is exited transition it to the source and point it to the source (no length)
  link.exit()
    .transition()
    .duration(750)
    .attr("d", function(d) {
      return diagonal({
        source: source,
        target: source
      });
    })
    .remove();

  // Each node that is being added
  var nodeEnter = node.enter()
    .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      });

  nodeEnter
    .append("rect")
      .attr("width", 1e-6)
      .attr("height", 1e-6)
      .style("fill", function(d) {
        // If d has hidden children style it differently
        return d._children ? "lightsteelblue" : "#fff";
      })
      .on("click", click);

  nodeEnter
    .append("image")
      .attr("xlink:href", "http://www.gravatar.com/avatar/5424688b4ed6dfdc3a8f2ed73769bbbd?d=mm&f=y")
      .attr("width", 0)
      .attr("height", 0);

  nodeEnter
    .append("a")
      .attr("xlink:href", function(d) {
        return d.link || "#";
      })
    .append("text")
      .attr("dx", -nodeWidth / 2 + 100)
      .attr("dy", -9)
      .text(function(d) {
        return d.name;
      })
      .style("fill-opacity", 1e-6);

  nodeEnter
    .append("text")
      .attr("dx", -nodeWidth / 2 + 100)
      .attr("dy", 9)
      .text(function(d) {
        return d.position;
      })
      .style("fill-opacity", 1e-6);

  // Each node which is being updated
  var nodeUpdate = node.transition()
    .duration(750)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  nodeUpdate
    .selectAll("text")
      .style("fill-opacity", 1);

  nodeUpdate
    .selectAll("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("x", -nodeWidth / 2)
      .attr("y", -nodeHeight / 2)
      .style("fill", function(d) {
        return d.fetched ? "palegreen" : "#fff";
      });

  nodeUpdate
    .selectAll("image")
      .attr("width", 80)
      .attr("height", 80)
      .attr("x", -nodeWidth / 2 + 10)
      .attr("y", -nodeHeight / 2 + 10);

  // Each node being removed
  var nodeExit = node.exit().transition()
    .duration(750)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit
    .selectAll("text")
      .style("fill-opacity", 1e-6);

  nodeExit
    .selectAll("rect")
      .attr("width", 1e-6)
      .attr("height", 1e-6)
      .attr("x", 0)
      .attr("y", 0);

  nodeExit
    .selectAll("image")
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", 0)
      .attr("y", 0);

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

var click = function(d) {
  var node = d3.select(this);
  switchRoot(d, node);
}

// Make d the new root and show its children
var switchRoot = function(d, node) {
  if (d === head) {
    // d is the current head of the tree
    if (d.parent) {
      // d has a parent so make it the head of the tree
      head = d.parent;
      hideChildren(d);
      update(d);
    }
    return;
  } else {
    if (d.fetched) {
      // Children have been fetched
      if (d._children) {
        // There are hidden children
        makeHead(d);
      }
    } else {
      // Children have not been fetched
      node.style("fill", "lightblue"); // Show busy style
      setTimeout(function() {
        d3.json("data/" + (d.username || "default") + ".json", function(error, root) {
          if (error) {
            console.error(error);
            node.style("fill", "tomato"); // Show error style
            return;
          }
          d._children = root && root.children || null;
          d.fetched = true;
          makeHead(d);
          node.style("fill", "white"); // Hide busy style
        });
      }, 1000);
    }
  }
}

var makeHead = function(d) {
  d.parent = head;
  showChildren(d);
  head = d;
  update(d);
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
