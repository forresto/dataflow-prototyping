(function(){
  "use strict";

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
    var kGraph = {id: "root", children: [], edges: []};

    // encode nodes
    var processes = graph.processes;
    var nodeKeys = Object.keys(processes);
    var nodes = nodeKeys.map(function (key) {
      var process = processes[key];
      kGraph.children.push({id: key, 
                            labels: [{text: process.metadata.label}], 
                            width: 72, 
                            height: 72});
    });

    // encode edges
    var currentEdge = 0;
    var connections = graph.connections;
    var edges = connections.map(function (connection) {
      if (connection.data !== undefined) {
        return;
      }
      var source = connection.src.process;
      var target = connection.tgt.process;
      kGraph.edges.push({id: "e" + currentEdge++, 
                         source: source,
                         target: target});
    });

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
      })[0];
      process.metadata.x = kNode.x;
      process.metadata.y = kNode.y;
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
