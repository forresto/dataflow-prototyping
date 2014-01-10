(function (context) {
  "use strict";

  var TheGraph = context.TheGraph;

  // Const
  var CURVE = 50;


  // Edge view

  TheGraph.Edge = React.createClass({
    componentWillMount: function() {
      // Todo: listen for source/target moving; change state
    },
    render: function() {
      var sourceX = this.props.source.metadata.x + TheGraph.nodeSize;
      var sourceY = this.props.source.metadata.y + this.props.sourcePort.y;
      var targetX = this.props.target.metadata.x + 0;
      var targetY = this.props.target.metadata.y + this.props.targetPort.y;

      var c1X, c1Y, c2X, c2Y;
      if (targetX > sourceX+CURVE/2) {
        c1X = sourceX + (targetX - sourceX)/2;
        c1Y = sourceY;
        c2X = c1X;
        c2Y = targetY;
      } else {
        c1X = sourceX + CURVE;
        c1Y = sourceY;
        c2X = targetX - CURVE;
        c2Y = targetY;
      }

      var path = [
        "M",
        sourceX, sourceY,
        "C",
        c1X, c1Y,
        c2X, c2Y,
        targetX, targetY
      ].join(" ");
      return (
        React.DOM.g(
          {className: "edge route"+this.props.route},
          React.DOM.path({
            className: "edge-bg",
            d: path
          }),
          React.DOM.path({
            className: "edge-fg",
            d: path
          })
        )
      );
    }
  });

})(this);