(function (context) {
  "use strict";

  var TheGraph = context.TheGraph;

  // Graph view

  TheGraph.Graph = React.createClass({
    mixins: [TheGraph.mixins.FakeMouse],
    getInitialState: function() {
      return {
        graph: this.props.graph
      };
    },
    componentDidMount: function () {
      this.getDOMNode().addEventListener("the-graph-node-move", this.markDirty);
      this.getDOMNode().addEventListener("the-graph-group-move", this.moveGroup);
    },
    moveGroup: function (event) {
      var graph = this.state.graph;
      var group = graph.groups[ event.detail.index ];
      var nodes = group.nodes;

      // Move each group member
      var len = nodes.length;
      for (var i=0; i<len; i++) {
        var node = graph.processes[ nodes[i] ];
        node.metadata.x += event.detail.x;
        node.metadata.y += event.detail.y;
      }

      this.markDirty();
    },
    getOutport: function (processName, portName) {
      var ports = this.getPorts(processName);
      if ( !ports.outports[portName] ) {
        ports.outports[portName] = {
          label: portName,
          x: TheGraph.nodeSize,
          y: TheGraph.nodeSize/2
        };
        this.dirty = true;
      }
      return ports.outports[portName];
    },
    getInport: function (processName, portName) {
      var ports = this.getPorts(processName);
      if ( !ports.inports[portName] ) {
        ports.inports[portName] = {
          label: portName,
          x: 0,
          y: TheGraph.nodeSize/2
        };
        this.dirty = true;
      }
      return ports.inports[portName];
    },
    getPorts: function (processName) {
      var process = this.state.graph.processes[processName];
      if (!process) {
        throw new Error("No process in the current graph with key: "+ processName);
      }
      if (!process.metadata.ports) {
        process.metadata.ports = {
          inports: {},
          outports: {}
        };
      }
      return process.metadata.ports;
    },
    dirty: false,
    markDirty: function () {
      this.setState({
        graph: this.state.graph
      });
      this.dirty = true;
    },
    shouldComponentUpdate: function () {
      // If ports change or nodes move, then edges need to rerender, so we do the whole graph
      return this.dirty;
    },
    render: function() {
      // console.timeEnd("Graph.render");
      // console.time("Graph.render");

      this.dirty = false;

      var self = this;
      var graph = this.state.graph;
      var processes = graph.processes;

      // Nodes
      var nodes = Object.keys(processes).map(function (key) {
        var process = processes[key];
        if (!process.metadata) {
          process.metadata = {x:0, y:0};
        }
        if (!process.metadata.label || process.metadata.label === "") {
          process.metadata.label = key;
        }
        return TheGraph.Node({
          key: key,
          x: process.metadata.x,
          y: process.metadata.y,
          label: process.metadata.label,
          app: self.props.app,
          process: process
        });
      });

      // Groups
      var index = -1;
      var groups = graph.groups.map(function (group) {
        if (group.nodes.length < 1) {
          return;
        }
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;

        var nodes = group.nodes;
        var len = nodes.length;
        for (var i=0; i<len; i++) {
          var key = nodes[i];
          var process = graph.processes[ key ];
          if (!process) {
            throw new Error("Didn't find group member "+key+" when making group "+group.name);
          }
          if (process.metadata.x < minX) { minX = process.metadata.x; }
          if (process.metadata.y < minY) { minY = process.metadata.y; }
          if (process.metadata.x > maxX) { maxX = process.metadata.x; }
          if (process.metadata.y > maxY) { maxY = process.metadata.y; }
        }
        if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
          minX = 0;
          minY = 0;
          maxX = 0;
          maxY = 0;
          return;
        }
        index++;
        return TheGraph.Group({
          index: index,
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
          scale: self.props.scale,
          label: group.name,
          description: group.metadata.description
        });
      });

      // Edges
      var connections = graph.connections;
      var edges = connections.map(function (connection) {
        if (connection.data !== undefined) {
          // IIP
          return;
        }
        var source = processes[connection.src.process];
        var target = processes[connection.tgt.process];
        if (!source || !target) {
          throw new Error("Edge source or target not found.");
        }

        // Initial ports from edges
        var sourcePort = self.getOutport(connection.src.process, connection.src.port);
        var targetPort = self.getInport(connection.tgt.process, connection.tgt.port);

        var route;
        if (connection.metadata && connection.metadata.route) {
          route = connection.metadata.route;
        } else {
          route = 0;
        }

        // Label
        var label = source.metadata.label + " " + connection.src.port.toUpperCase() + " -> " + 
          connection.tgt.port.toUpperCase() + " " + target.metadata.label + "";

        return TheGraph.Edge({
          sX: source.metadata.x + TheGraph.nodeSize,
          sY: source.metadata.y + sourcePort.y,
          tX: target.metadata.x,
          tY: target.metadata.y + targetPort.y,
          label: label,
          route: route
        });
      });

      return React.DOM.g(
        {
          className: "graph"//,
          // onMouseDown: this.onMouseDown
        },
        React.DOM.g({
          className: "groups",
          children: groups
        }),
        React.DOM.g({
          className: "edges",
          children: edges
        }),
        React.DOM.g({
          className: "nodes", 
          children: nodes
        })
      );
    }
  });  

})(this);