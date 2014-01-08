(function (context) {
  "use strict";

  var TheGraph = context.TheGraph;


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
      var curve = 50;
      var path = [
        "M",
        sourceX, sourceY,
        "C",
        sourceX + curve, sourceY,
        targetX - curve, targetY,
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