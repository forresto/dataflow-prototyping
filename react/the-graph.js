(function (context) {
  "use strict";

  // Dumb module setup
  if (!context.TheGraph) { 
    context.TheGraph = {
      nodeSize: 72,
      nodeRadius: 8,
      nodeSide: 56
    }; 
  }
  var TheGraph = context.TheGraph;

  // React setup
  React.initializeTouchEvents(true);

  // Mouse as fake touch
  var mixinFakeMouse = (
    function () { 
      return {
        onTouchStart: function (event) {
          event.preventDefault();
          if (event.touches && event.touches.length === 1) {
            this.onMouseDown(event);
          }
        },
        onTouchMove: function (event) {
          event.preventDefault();
          this.onMouseMove(event);
        },
        onTouchEnd: function (event) {
          event.preventDefault();
          if (event.touches && event.touches.length === 0) {
            this.onMouseUp(event);
          }
        },
        componentDidMount: function (rootNode) {
          // First touch maps to mouse
          this.getDOMNode().addEventListener("touchstart", this.onTouchStart);
          this.getDOMNode().addEventListener("touchmove", this.onTouchMove);
          this.getDOMNode().addEventListener("touchend", this.onTouchEnd);
          this.getDOMNode().addEventListener("touchcancel", this.onTouchEnd);
        }
      }
    }
  )();


  TheGraph.App = React.createClass({
    minZoom: 0.04,
    mixins: [mixinFakeMouse],
    getInitialState: function() {
      return {
        x: 0,
        y: 0,
        scale: 1,
        width: this.props.width,
        height: this.props.height
      };
    },
    onWheel: function (event) {
      // Don't bounce
      event.preventDefault();

      var scale = this.state.scale + (this.state.scale * event.deltaY/500);
      if (scale < this.minZoom) { return; }

      // Zoom and pan transform-origin equivalent
      var scaleD = scale / this.state.scale;
      var currentX = this.state.x;
      var currentY = this.state.y;
      var oX = event.nativeEvent.pageX;
      var oY = event.nativeEvent.pageY;
      var x = scaleD * (currentX - oX) + oX;
      var y = scaleD * (currentY - oY) + oY;

      this.setState({
        scale: scale,
        x: x,
        y: y
      });
    },
    mouseX: 0,
    mouseY: 0,
    mousePressed: false,
    onMouseDown: function (event) {
      var x, y;
      if (event.touches) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
      } else {
        x = event.pageX;
        y = event.pageY;
      }
      this.mousePressed = true;
      this.mouseX = x;
      this.mouseY = y;
    },
    onMouseMove: function (event) {
      // Pan
      if (this.mousePressed) {
        var x, y;
        if (event.touches) {
          x = event.touches[0].pageX;
          y = event.touches[0].pageY;
        } else {
          x = event.pageX;
          y = event.pageY;
        }
        var deltaX = x - this.mouseX;
        var deltaY = y - this.mouseY;
        this.setState({
          x: this.state.x + deltaX,
          y: this.state.y + deltaY
        });
        this.mouseX = x;
        this.mouseY = y;
      }
    },
    onMouseUp: function (event) {
      this.mousePressed = false;
    },
    componentDidMount: function (rootNode) {
      // Mouse listen to window for drag/release outside
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);

      // Start zoom from middle if zoom before mouse move
      this.mouseX = Math.floor( window.innerWidth/2 );
      this.mouseY = Math.floor( window.innerHeight/2 );
    },
    componentDidUpdate: function (prevProps, prevState, rootNode) {
    },
    render: function() {
      // console.timeEnd("App.render");
      // console.time("App.render");

      // pan and zoom
      var sc = this.state.scale;
      var x = this.state.x;
      var y = this.state.y;
      var transform = "matrix("+sc+",0,0,"+sc+","+x+","+y+")";

      var scaleClass = sc > 1.2 ? "big" : ( sc < 0.4 ? "small" : "normal");

      return React.DOM.div(
        {
          className: "the-graph " + scaleClass,
          name:"app", 
          onWheel: this.onWheel,
          onMouseDown: this.onMouseDown,
          style: {
            width: this.state.width,
            height: this.state.height
          }
        },
        React.DOM.svg(
          {
            width: this.state.width, 
            height: this.state.height
          },
          React.DOM.g(
            {
              className: "view",
              transform: transform
            },
            TheGraph.Graph({
              graph: this.props.graph,
              scale: this.state.scale
            })
          )
        )
      );
    }
  });


  // Graph view

  TheGraph.Graph = React.createClass({
    mixins: [mixinFakeMouse],
    getInitialState: function() {
      return {
        graph: this.props.graph
      };
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
    shouldComponentUpdate: function () {
      // If ports change or nodes move, then edges need to rerender, so we do the whole graph
      return this.dirty;
    },
    dragItemKey: null,
    mouseX: 0,
    mouseY: 0,
    onMouseDown: function (event) {
      // Touch to mouse
      var x, y, target;
      if (event.touches) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
        target = event.touches[0].target;
      } else {
        x = event.pageX;
        y = event.pageY;
        target = event.target;
      }

      this.dragItemKey = target.getAttribute("name");

      if (this.dragItemKey) {
        // Don't drag graph
        event.stopPropagation();

        this.mouseX = x;
        this.mouseY = y;
      }
    },
    onMouseMove: function (event) {
      if (this.dragItemKey) {
        // Don't fire on graph
        event.stopPropagation();

        // Touch to mouse
        var x, y;
        if (event.touches) {
          x = event.touches[0].pageX;
          y = event.touches[0].pageY;
        } else {
          x = event.pageX;
          y = event.pageY;
        }

        var process = this.state.graph.processes[this.dragItemKey];
        if (process) {
          var deltaX = Math.round( (x - this.mouseX) / this.props.scale );
          var deltaY = Math.round( (y - this.mouseY) / this.props.scale );
          process.metadata.x += deltaX;
          process.metadata.y += deltaY;
          this.mouseX = x;
          this.mouseY = y;

          this.setState({graph: this.state.graph});
          this.dirty = true;
          return;
        }
        // var group = this.state.graph.groups
      }
    },
    onMouseUp: function (event) {
      if (this.dragItemKey) {
        // Don't fire on graph
        if (event.stopPropagation) { event.stopPropagation(); }
        this.dragItemKey = null;
      }
    },
    componentDidMount: function () {
      // Mouse listen to window for drag/release outside
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);
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
        return TheGraph.Node({
          key: key,
          x: process.metadata.x,
          y: process.metadata.y,
          process: process
        });
      });

      // Groups
      var groups = graph.groups.map(function (group) {
        if (group.nodes.length < 1) {
          return;
        }
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        var members = group.nodes.map(function(key){
          var process = graph.processes[key];
          if (!process) {
            throw new Error("Didn't find group member "+key+" when making group "+group.id);
          }
          if (process.metadata.x < minX) { minX = process.metadata.x; }
          if (process.metadata.y < minY) { minY = process.metadata.y; }
          if (process.metadata.x > maxX) { maxX = process.metadata.x; }
          if (process.metadata.y > maxY) { maxY = process.metadata.y; }
          return process;
        });
        if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
          minX = 0;
          minY = 0;
          maxX = 0;
          maxY = 0;
          return;
        }
        return TheGraph.Group({
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
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
        return TheGraph.Edge({
          sX: source.metadata.x + TheGraph.nodeSize,
          sY: source.metadata.y + sourcePort.y,
          tX: target.metadata.x,
          tY: target.metadata.y + targetPort.y,
          route: route
        });
      });

      return React.DOM.g(
        {
          className: "graph",
          onMouseDown: this.onMouseDown
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