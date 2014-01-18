(function (context) {
  "use strict";

  // Dumb module setup
  if (!context.TheGraph) { 
    context.TheGraph = {
      nodeSize: 72,
      nodeRadius: 8,
      nodeSide: 56,
      // Zoom breakpoints
      zbpBig: 1.2,
      zbpNormal: 0.4,
      zbpSmall: 0.01
    }; 
  }
  var TheGraph = context.TheGraph;

  // React setup
  React.initializeTouchEvents(true);

  // rAF shim
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  // Mixins to use throughout project
  TheGraph.mixins = {};

  // Touch to mouse
  // Class must have onMouseDown onMouseMove onMouseUp
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
  // Class must have getTooltipTrigger (dom node) and shouldShowTooltip (boolean)
  TheGraph.mixins.Tooltip = {
    showTooltip: function (event) {
      if ( !this.shouldShowTooltip() ) { return; }

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
      if ( !this.shouldShowTooltip() ) { return; }

      var tooltipEvent = new CustomEvent('the-graph-tooltip-hide', { 
        bubbles: true
      });
      this.getDOMNode().dispatchEvent(tooltipEvent);
    },
    componentDidMount: function (rootNode) {
      if (navigator && navigator.userAgent.indexOf("Firefox") !== -1) {
        // HACK Ff does native tooltips on svg elements
        return;
      }
      var tooltipper = this.getTooltipTrigger();
      tooltipper.addEventListener("mouseenter", this.showTooltip);
      tooltipper.addEventListener("mouseleave", this.hideTooltip);
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
    zoomFactor: 0,
    zoomX: 0,
    zoomY: 0,
    onWheel: function (event) {
      // TODO: fast transform3d here?

      // Don't bounce
      event.preventDefault();

      if (!this.zoomFactor) { // WAT
        this.zoomFactor = 0;
      }

      this.zoomFactor += event.deltaY;
      this.zoomX = event.nativeEvent.pageX;
      this.zoomY = event.nativeEvent.pageY;
      requestAnimationFrame(this.scheduleZoom);
    },
    scheduleZoom: function () {
      if (isNaN(this.zoomFactor)) { return; };

      var scale = this.state.scale + (this.state.scale * this.zoomFactor/500);
      this.zoomFactor = 0;

      if (scale < this.minZoom) { 
        scale = this.minZoom;
      }
      if (scale === this.state.scale) { return; }

      // Zoom and pan transform-origin equivalent
      var scaleD = scale / this.state.scale;
      var currentX = this.state.x;
      var currentY = this.state.y;
      var oX = this.zoomX;
      var oY = this.zoomY;
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
    onChangeHighlight: function (event) {
      console.log(event);
    },
    changeTooltip: function (event) {
      var tooltip = event.detail.tooltip;

      // Don't go over right edge
      var x = event.detail.x + 10;
      var width = tooltip.length*6;
      if (x + width > this.props.width) {
        x = event.detail.x - width - 10;
      }

      this.setState({
        tooltip: tooltip,
        tooltipVisible: true,
        tooltipX: x,
        tooltipY: event.detail.y + 20
      });
    },
    hideTooltip: function (event) {
      this.setState({
        tooltipVisible: false
      });
    },
    onFit: function (event) {
      var limits = event.detail;
      limits.minX -= TheGraph.nodeSize;
      limits.minY -= TheGraph.nodeSize;
      limits.maxX += TheGraph.nodeSize * 2;
      limits.maxY += TheGraph.nodeSize * 2;

      var scaleX = this.state.width / (limits.maxX - limits.minX);
      var scaleY = this.state.height / (limits.maxY - limits.minY);
      var scale = Math.min(scaleX, scaleY);

      this.setState({
        x: 0 - limits.minX * scale,
        y: 0 - limits.minY * scale,
        scale: scale
      });
    },
    componentDidMount: function (rootNode) {
      // Mouse listen to window for drag/release outside

      // Tooltip listener
      this.getDOMNode().addEventListener("the-graph-tooltip", this.changeTooltip);
      this.getDOMNode().addEventListener("the-graph-tooltip-hide", this.hideTooltip);

      // Custom event listeners
      this.getDOMNode().addEventListener("the-graph-node-highlight", this.onChangeHighlight);
      this.getDOMNode().addEventListener("the-graph-fit", this.onFit);

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

      var scaleClass = sc > TheGraph.zbpBig ? "big" : ( sc > TheGraph.zbpNormal ? "normal" : "small");

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
              ref: "graph",
              graph: this.props.graph,
              scale: this.state.scale,
              app: this
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