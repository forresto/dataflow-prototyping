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

  var toNoFlo = function (oGraph, kGraph) {
    // take the original noflo's graph (oGraph) and annotate it with layout info
    // from kieler's graph (kGraph)
    // console.log('ORIGINAL GRAPH', oGraph);
    // console.log('KGRAPH', $.parseJSON(kGraph)[0]);
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
    console.log(oGraph);
    // update oGraph edges (and ports) as well
  };
       
  window.kieler = function (graph, render) {
    var kGraph = toKieler(graph);

    // some layout options
    var options = {
      spacing: 15,
      algorithm: "de.cau.cs.kieler.klay.layered"
    };
  
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

  // window.onload = function () {
  //   var script = document.createElement('script');
  //   script.src = 'noflo.json.js';
  //   document.head.appendChild(script);
  // };

})();
