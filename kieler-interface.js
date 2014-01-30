(function(){
  "use strict";

  Array.prototype.clean = function() {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == null) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

  // from kielerlayout.js
  var kielerLayout = function(opts) {
    // gather information
    var server = opts.server || "http://localhost:9444";
    var graph = opts.graph;
    var options = opts.options || {};
    var iFormat = opts.iFormat;
    var oFormat = opts.oFormat;
    var success = opts.success;
    var error = opts.error || function() {};
    
    // check whether the graph is a string or json
    if (typeof graph === 'object') {
      graph = JSON.stringify(graph)
    }
    
    $.ajax({
      type : 'POST',
      contentType : 'application/json',
      url : server + '/live',
      data : {
        graph : graph,
        config : JSON.stringify(options),
        iFormat : iFormat,
        oFormat : oFormat
      },
      success : success,
      error : error
    });
  };

  // encode the original NoFlo graph to a KGraph (KIELER Graph) JSON
  var toKieler = function (graph) {
    var kGraph = {id: 'root',
                  children: [], 
                  edges: []};

    // encode nodes
    var processes = graph.processes;
    var nodeKeys = Object.keys(processes);
    var idx = {};
    var countIdx = 0;
    var nodes = nodeKeys.map(function (key) {
      var process = processes[key];
      kGraph.children.push({id: key, 
                            labels: [{text: process.metadata.label}], 
                            width: 92, // Math.max(72, 8*process.metadata.label.length), 
                            height: 72,
                            ports: []});
      idx[key] = countIdx++;
    });

    // encode edges (and ports on both edges and already encoded nodes)
    var currentEdge = 0;
    var connections = graph.connections;
    var edges = connections.map(function (connection) {
      if (connection.data !== undefined) {
        return;
      }
      var source = connection.src.process;
      var sourcePort = connection.src.port;
      var target = connection.tgt.process;
      var targetPort = connection.tgt.port;
      kGraph.edges.push({id: 'e' + currentEdge++, 
                         source: source,
                         // KGraph edges doesn't allow the same name to
                         // both sourcePort and targetPort, so...
                         sourcePort: source + '_' + sourcePort,
                         target: target,
                         targetPort: target + '_' + targetPort});
      // complete nodes encoding adding ports to them
      var ports = kGraph.children[idx[source]].ports;
      var port = {id: source + '_' + sourcePort, 
                  width: 10, 
                  height: 10, 
                  properties: {'de.cau.cs.kieler.portSide': 'SOUTH'}};
      if (ports.indexOf(port) < 0) {
        ports.push(port);
      }

      var ports = kGraph.children[idx[target]].ports;
      var port = {id: target + '_' + targetPort, 
                  width: 10, 
                  height: 10, 
                  properties: {'de.cau.cs.kieler.portSide': 'NORTH'}};
      if (ports.indexOf(port) < 0) {
        ports.push(port);
      }
    });

    // encode groups
    var groups = graph.groups;
    var countGroups = 0;
    groups.map(function (group) {
      // create a node to use as a subgraph
      var node = {id: 'group' + countGroups++, 
                  properties: {'de.cau.cs.kieler.layoutHierarchy': true},
                  children: [], 
                  edges: []};
      // build the node/subgraph
      group.nodes.map(function (n) {
        node.children.push(kGraph.children[idx[n]]);
        node.edges.push(kGraph.edges.filter(function (edge) {
          if (edge) {
            if ((edge.source === n) || (edge.target === n)) {
              return edge;
            }
          }
        })[0]);

        // mark nodes inside the group to be removed from the graph
        kGraph.children[idx[n]] = null;

      });
      // mark edges too
      node.edges.map(function (edge) {
        if (edge) {
          kGraph.edges[parseInt(edge.id.substr(1))] = null;
        }
      });
      // add node/subgraph to the graph
      kGraph.children.push(node);
    });

    // remove the nodes and edges from the graph, just preserve them inside the
    // subgraph/group
    kGraph.children.clean();
    kGraph.edges.clean();
    // console.log(JSON.stringify(kGraph));
    return kGraph;
  };

  // encode the original NoFlo graph and annotate it with layout info from
  // the received KIELER graph
  var toNoFlo = function (oGraph, kGraph) {
    kGraph = $.parseJSON(kGraph)[0];

    // update oGraph nodes with the new coordinates from KIELER layout
    var processes = oGraph.processes;
    var nodeKeys = Object.keys(processes);
    var nodes = nodeKeys.map(function (key) {
      var process = processes[key];
      var children = kGraph.children;

      var kNode = children.filter(function (el) {
        if (el.id === key)
          return el;
        // TODO: too ugly! we need a recursive method
        if (el.children) {
          // we have a child node (subgraph member)
          var grandchildren = el.children;
          var foo = grandchildren.filter(function (ell) {
            if (ell.id === key) {
              // we should add mom's coords to the child
              process.metadata.x = ell.x + el.x;
              process.metadata.y = ell.y + el.y;
              return ell;
            }
          })[0];
          return foo; 
        }
      })[0];

      if (kNode) {
        if (!kNode.children) {
          process.metadata.x = kNode.x;
          process.metadata.y = kNode.y;
        }
      }
    });
    // TODO: update oGraph edges (and ports) as well
    return oGraph;
  };

  // main interface for now: apply KIELER layout algorithm and render when xhr
  // is done
  window.kieler = function (graph, gui, render) {
    var kGraph = toKieler(graph);
    var options = gui || {};
    options.algorithm = "de.cau.cs.kieler.klay.layered";
    options.layoutHierarchy = true;

    // perform the layout request
    kielerLayout({
      server: 'http://layout.rtsys.informatik.uni-kiel.de:9444',
      graph: kGraph,
      options: options,
      iFormat: 'org.json',
      oFormat: 'org.json',
      // pass a callback method, which is used upon success
      success : function (data) {
        var nofloGraph = toNoFlo(graph, data);
        render(nofloGraph);
      },
      // in case of an error, write it to the log
      error : function (error) {
        console.log("Error: " + JSON.stringify(error));             
      }
    });
  };

})();
