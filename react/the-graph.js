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


  // Interactions

  TheGraph.App = React.createClass({
    minZoom: 0.04,
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

      if (this.keyPan) {
        this.setState({
          x: this.state.x - event.deltaX,
          y: this.state.y + event.deltaY
        });
      } else {
        var scale = this.state.scale + (this.state.scale * event.deltaY/500);
        if (scale < this.minZoom) { return; }

        // Zoom and pan transform-origin equivalent
        var scaleD = scale / this.state.scale;
        var currentX = this.state.x;
        var currentY = this.state.y;
        var oX = this.mouseX;
        var oY = this.mouseY;
        var x = scaleD * (currentX - oX) + oX;
        var y = scaleD * (currentY - oY) + oY;

        this.setState({
          scale: scale,
          x: x,
          y: y
        });
      }
    },
    keyPan: false,
    onKeyUpDown: function (event) {
      // console.log(event);
      if (event.keyCode === 32 /* space */) {
        // Don't scroll with space
        event.preventDefault();
        this.keyPan = (event.type === "keydown");
      }
    },
    mouseX: 0,
    mouseY: 0,
    mousePressed: false,
    draggingElement: null,
    onMouseDown: function (event) {
      this.mousePressed = true;
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
    },
    onMouseMove: function (event) {
      // Pan
      if (this.mousePressed) {
        var deltaX = event.pageX - this.mouseX;
        var deltaY = event.pageY - this.mouseY;
        this.setState({
          x: this.state.x + deltaX,
          y: this.state.y + deltaY
        });
      }
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
    },
    onMouseUp: function (event) {
      this.mousePressed = false;
    },
    componentDidMount: function () {
      window.addEventListener("keydown", this.onKeyUpDown);
      window.addEventListener("keyup", this.onKeyUpDown);

      // Mouse listen to window for drag/release outside
      window.addEventListener("mousedown", this.onMouseDown);
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);

      // Start zoom from middle if zoom before mouse move
      this.mouseX = Math.floor( window.innerWidth/2 );
      this.mouseY = Math.floor( window.innerHeight/2 );
    },
    render: function() {
      // pan and zoom
      var sc = this.state.scale;
      var x = this.state.x;
      var y = this.state.y;
      var transform = "matrix("+sc+",0,0,"+sc+","+x+","+y+")";

      var scaleClass = sc > 1.2 ? "big" : ( sc < 0.4 ? "small" : "normal");
      console.log(scaleClass);

      return React.DOM.div(
        {
          className: "the-graph " + scaleClass,
          name:"app", 
          onWheel: this.onWheel
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
            TheGraph.Graph({graph: this.props.graph})
          )
        )
      );
    }
  });


  // Graph view

  TheGraph.Graph = React.createClass({
    getInitialState: function() {
      return {
        graph: this.props.graph
      };
    },
    ports: {},
    getOutport: function (processName, portName) {
      var ports = this.ports[processName];
      var outport = ports.outports[ ports.outportKeys.indexOf(portName) ];
      if ( !outport ) {
        outport = {
          label: portName,
          x: TheGraph.nodeSize,
          y: TheGraph.nodeSize/2
        };
        ports.outportKeys.push(portName);
        ports.outports.push(outport);
      }
      return outport;
    },
    getInport: function (processName, portName) {
      var ports = this.ports[processName];
      var inport = ports.inports[ ports.inportKeys.indexOf(portName) ];
      if ( !inport ) {
        inport = {
          label: portName,
          x: 0,
          y: TheGraph.nodeSize/2
        };
        ports.inportKeys.push(portName);
        ports.inports.push(inport);
      }
      return inport;
    },
    getPorts: function (process) {
      if (!this.ports[process]) {
        this.ports[process] = {
          inportKeys: [],
          inports: [],
          outportKeys: [],
          outports: []
        };
      }
      return this.ports[process];
    },
    render: function() {
      var self = this;

      // Nodes
      var processes = this.state.graph.processes;
      var nodes = Object.keys(processes).map(function (key) {
        var process = processes[key];
        return TheGraph.Node({
          key: key,
          process: process,
          // This might not be pure, since these objects change later in this function
          ports: self.getPorts(key) 
        });
      });

      // Edges
      var connections = this.state.graph.connections;
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
          source: source,
          sourcePort: sourcePort,
          target: target,
          targetPort: targetPort,
          route: route
        });
      });

      var group = React.DOM.g(
        {
          className: "graph"
        },
        React.DOM.g({
          className: "edges",
          children: edges
        }),
        React.DOM.g({
          className: "nodes", 
          children: nodes
        })
      );
      return group;
    }
  });  

})(this);