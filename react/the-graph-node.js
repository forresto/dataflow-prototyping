(function (context) {
  "use strict";

  var TheGraph = context.TheGraph;


  // Node view

  TheGraph.Node = React.createClass({
    render: function() {
      var label = this.props.process.metadata.label;
      if (label === undefined || label === "") {
        label = this.props.process.key;
      }
      var x = this.props.process.metadata.x;
      var y = this.props.process.metadata.y;

      // Ports
      var count = this.props.ports.inports.length;
      var index = 0;
      var inports = this.props.ports.inports.map(function(name){
        index++;
        return TheGraph.Port({
          x: 0,
          y: TheGraph.nodeRadius + (TheGraph.nodeSide / (count+1) * index),
          label: name
        })
      });

      count = this.props.ports.outports.length;
      index = 0;
      var outports = this.props.ports.outports.map(function(name){
        index++;
        return TheGraph.Port({
          x: TheGraph.nodeSize,
          y: TheGraph.nodeRadius + (TheGraph.nodeSide / (count+1) * index),
          label: name
        })
      });

      return (
        React.DOM.g(
          {
            name: label,
            key: this.props.key,
            transform: "translate("+x+","+y+")"
          },
          React.DOM.rect({
            width: 72,
            height: 72,
            rx: 8,
            ry: 8
          }),
          React.DOM.g({
            className: "inports",
            children: inports
          }),
          React.DOM.g({
            className: "outports",
            children: outports
          }),
          React.DOM.text({
            x: 36,
            y: 92,
            children: label
          })
        )
      );
    }
  });


})(this);