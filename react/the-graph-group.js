(function (context) {
  "use strict";

  var TheGraph = context.TheGraph;


  // Group view

  TheGraph.Group = React.createClass({
    render: function() {
      var x = this.props.minX - TheGraph.nodeSize/2;
      var y = this.props.minY - TheGraph.nodeSize/2;
      return (
        React.DOM.g(
          {
            className: "group"
            // transform: "translate("+x+","+y+")"
          },
          React.DOM.rect({
            className: "group-box drag",
            x: x,
            y: y,
            rx: TheGraph.nodeRadius,
            ry: TheGraph.nodeRadius,
            width: this.props.maxX - this.props.minX + TheGraph.nodeSize*2,
            height: this.props.maxY - this.props.minY + TheGraph.nodeSize*2,
            fill: "yellow"
          }),
          React.DOM.text({
            className: "group-label",
            x: x + TheGraph.nodeRadius,
            y: y,
            children: this.props.label
          }),
          React.DOM.text({
            className: "group-description",
            x: x + TheGraph.nodeRadius,
            y: y + 10 + TheGraph.nodeRadius,
            children: this.props.description
          })
        )
      );
    }
  });


})(this);