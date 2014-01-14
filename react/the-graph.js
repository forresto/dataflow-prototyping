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

  // Mixins to use throughout project
  TheGraph.mixins = {};

  // Touch to mouse
  TheGraph.mixins.FakeMouse = {
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
  };

  // Show fake tooltip
  TheGraph.mixins.Tooltip = {
    showTooltip: function (event) {
      var tooltipEvent = new CustomEvent('the-graph-tooltip', { 
        detail: {
          tooltip: this.props.label,
          x: event.pageX,
          y: event.pageY
        }, 
        bubbles: true
      });
      this.getDOMNode().dispatchEvent(tooltipEvent);
    },
    hideTooltip: function (event) {
      var tooltipEvent = new CustomEvent('the-graph-tooltip', { 
        detail: {
          tooltip: "",
          x: event.pageX,
          y: event.pageY
        }, 
        bubbles: true
      });
      this.getDOMNode().dispatchEvent(tooltipEvent);
    },
    componentDidMount: function (rootNode) {
      this.getDOMNode().addEventListener("mousemove", this.showTooltip);
      this.getDOMNode().addEventListener("mouseleave", this.hideTooltip);
    }
  };


  TheGraph.App = React.createClass({
    minZoom: 0.04,
    mixins: [TheGraph.mixins.FakeMouse],
    getInitialState: function() {
      return {
        x: 0,
        y: 0,
        scale: 1,
        width: this.props.width,
        height: this.props.height,
        tooltip: "",
        tooltipX: 0,
        tooltipY: 0,
        tooltipVisible: true
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
    onMouseDown: function (event) {
      if (event.button !== 0) {
        // Context menu
        return;
      }

      var x, y;
      if (event.touches) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
      } else {
        x = event.pageX;
        y = event.pageY;
      }
      this.mouseX = x;
      this.mouseY = y;

      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);
    },
    onMouseMove: function (event) {
      // Pan
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
    },
    onMouseUp: function (event) {
      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
    },
    changeHighlight: function (event) {
      console.log(event);
    },
    changeTooltip: function (event) {
      var tooltip = event.detail.tooltip;

      // HACK til 0.9.0
      if (tooltip !== this.state.tooltip) {
        this.refs.tooltip.changeLabel(tooltip);
      }

      this.setState({
        tooltip: tooltip,
        tooltipVisible: !(tooltip === ""),
        tooltipX: event.detail.x + 10,
        tooltipY: event.detail.y
      });
    },
    componentDidMount: function (rootNode) {
      // Mouse listen to window for drag/release outside

      // Tooltip listener
      this.getDOMNode().addEventListener("the-graph-tooltip", this.changeTooltip);

      // Custom event listeners
      this.getDOMNode().addEventListener("the-graph-node-highlight", this.changeHighlight);

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
          ),
          // React.DOM.g(
          //   {
          //     className: "highlight"
          //   }
          // ),
          TheGraph.Tooltip({
            ref: "tooltip",
            x: this.state.tooltipX,
            y: this.state.tooltipY,
            visible: this.state.tooltipVisible,
            label: this.state.tooltip
          })
        )
      );
    }
  });


})(this);