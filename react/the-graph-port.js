(function (context) {
  "use strict";

  var TheGraph = context.TheGraph;


  // Port view

  TheGraph.Port = React.createClass({
    render: function() {
      return (
        React.DOM.g(
          {
            className: "port"
          },
          React.DOM.circle({
            cx: this.props.x,
            cy: this.props.y,
            r: 4
          }),
          React.DOM.text({
            x: this.props.x,
            y: this.props.y,
            children: this.props.label
          })
        )
      );
    }
  });


})(this);