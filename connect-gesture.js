(function(){
"use strict";

var w = window.innerWidth;
var h = window.innerHeight;

function randomInt (max) {
  return Math.floor(Math.random()*max);
}

// Make some random nodes
var count = 5;
var graph = {};
var nodes = graph.nodes = [];
var ioMax = 5;
var nodeW = 75;
var nodeH = 75;
var nodeW2 = Math.floor(nodeW/2);
var nodeH2 = Math.floor(nodeH/2);
var margin = 10;
var gridW = nodeW + margin*2;
var gridH = nodeH + margin*2;
var gridCols = Math.floor( (w-margin*2)/(nodeW+margin*2) );
var gridRows = Math.floor( (h-margin*2)/(nodeH+margin*2) );

// CSS grid bg
document.body.style.backgroundSize = gridW+"px "+gridH+"px";

var i, j, k;
for (i=0; i<count; i++) {
  var node = {
    id: i,
    type: "node",
    x: randomInt(gridCols),
    y: randomInt(gridRows),
    parent: graph
  };
  node.inputs = [];
  var inputsCount = randomInt(ioMax) + 1;
  for (j=0; j<inputsCount; j++) {
    node.inputs.push({
      id: j,
      type: "input",
      name: "in"+j,
      parent: node
    });
  }
  node.outputs = [];
  var outputsCount = randomInt(ioMax) + 1;
  for (k=0; k<outputsCount; k++) {
    node.outputs.push({
      id: k, 
      type: "output",
      name: "out"+k, 
      parent: node
    });
  }
  nodes.push(node);
}

var graphEl = document.getElementById("graph");

var translate = function (el, x, y, z) {
  //if (z === undefined) { z = 0; }
  //var move = "translate3d("+x+"px,"+y+"px,"+z+"px)";
  var move = "translate("+x+"px,"+y+"px)";
  el.style.webkitTransform = move;
  el.style.MozTransform = move;
  el.style.msTransform = move;
  el.style.OTransform = move;
  el.style.transform = move;
  return el;
};

var translateGrid = function (el, x, y) {
  translate(el, x*gridW+margin, y*gridH+margin)
  return el;
};

// Make the node views
for (i=0; i<count; i++) {
  var node = nodes[i];
  var el = node.view = document.createElement("div");
  el.classList.add("node");
  var label = document.createElement("h1");
  label.innerHTML = "node"+node.id;
  label.style.width = nodeW + "px";
  el.appendChild( label );
  // Position
  translateGrid(el, node.x, node.y);
  // Size
  el.style.width = nodeW + "px";
  el.style.height = nodeH + "px";

  // HACK reference back
  el.model = node;

  // Inputs
  var inputsEl = document.createElement("div");
  inputsEl.classList.add("inputs");
  for (j=0; j<node.inputs.length; j++) {
    var input = node.inputs[j]
    var inputEl = document.createElement("div");
    inputEl.classList.add("port");
    inputEl.innerHTML = input.name;
    inputEl.model = input;
    input.view = inputEl;
    inputsEl.appendChild(inputEl);
  }
  el.appendChild(inputsEl);

  // Outputs
  var outputsEl = document.createElement("div");
  outputsEl.classList.add("outputs");
  for (k=0; k<node.outputs.length; k++) {
    var output = node.outputs[k];
    var outputEl = document.createElement("div");
    outputEl.classList.add("port");
    outputEl.innerHTML = output.name;
    outputEl.model = output;
    output.view = outputEl;
    outputsEl.appendChild(outputEl);
  }
  el.appendChild(outputsEl);

  graphEl.appendChild(el);

  el.onmousedown = el.ontouchstart = gestureStart;
}

document.onmousemove = document.ontouchmove = gestureMove;
document.onmouseup = document.ontouchend = gestureStop;

// TODO multidrag?
var gestureItem = null;

var threshold = 25;

var lastX, lastY;
function touchNormalize(event) {
  if (event.touches && event.touches.length > 0) {
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
  }
}

function gestureStart (event) {
  event.preventDefault();
  var model = event.target.model;
  if (!model || model.type!=="node") { return; }
  gestureItem = model;
  var gesture = model.gesture = {};
  touchNormalize(event);
  gesture.startX = event.clientX;
  gesture.startY = event.clientY;
  gesture.action = null;
};

function gestureMove (event) {
  event.preventDefault();
  if (!gestureItem) { return; }

  console.log(event);

  var gesture = gestureItem.gesture;
  touchNormalize(event);
  gesture.deltaX = event.clientX - gesture.startX;
  gesture.deltaY = event.clientY - gesture.startY;

  if (!gesture.action) {
    if (Math.abs(gesture.deltaY) > threshold) {
      // Move
      gesture.action = "move";
    } else if (gesture.deltaX > threshold) {
      // Start wire from output
      gesture.action = "wire-out";
      nodeShowOutputs(gestureItem);
    } else if (gesture.deltaX < 0-threshold) {
      // Start wire from input
      gesture.action = "wire-in";
      nodeShowInputs(gestureItem);
    }
  }
  else {
    switch (gesture.action) {
      case "move":
        translate(gestureItem.view, event.clientX-nodeW2, event.clientY-nodeH2);
        break;
      case "wire-out":
        var model = event.target.model;
        if (event.type === "touchmove" && event.target===gestureItem.view) {
          var over = document.elementFromPoint(event.clientX, event.clientY);
          model = over.model;
        }
        if (!model) { break; }
        else if (model.type === "output" || model.type === "input") {
          portSelect(model);
          // Dont mouseover node
          event.stopPropagation();
        }
        else if (model.type === "node") {
          nodeShowInputs(model);
        }
        break;
      case "wire-in":
        var model = event.target.model;
        if (event.type === "touchmove" && event.target===gestureItem.view) {
          var over = document.elementFromPoint(event.clientX, event.clientY);
          model = over.model;
        }
        if (!model) { break; }
        else if (model.type === "output" || model.type === "input") {
          portSelect(model);
          // Dont mouseover node
          event.stopPropagation(); 
        }
        else if (model.type === "node") {
          nodeShowOutputs(model);
        }
        break;
      default:
        break;
    }
  }
};

function gestureStop (event) {
  console.log("stop", event);
  event.preventDefault();
  if (!gestureItem) { return; }
  if (gestureItem.gesture.action === "move"){
    //Snap
    if (event.changedTouches && event.changedTouches[0]) {
      event.clientX = event.changedTouches[0].clientX;
      event.clientY = event.changedTouches[0].clientY;
    }
    nodeSnapToGrid(gestureItem, event.clientX, event.clientY);
  } else {
    graphHidePorts(gestureItem.parent);
  }
  gestureItem = null;
};

// IO helpers

function nodeBringToTop (node) {
  node.view.parentNode.appendChild(node.view);
}

function nodeShowInputs (node) {
  nodeBringToTop(node);
  if (node.insShown) { return; }
  for( var i=0; i<node.parent.nodes.length; i++ ) {
    var n = node.parent.nodes[i];
    if (n!==node) {
      // Hide others
      nodeHideInputs(n);
    }
  }
  // Show this
  node.view.classList.add("show-ins");
  node.insShown = true;
  // Activate 1st
  if (node.inputs[0] != null) {
    portSelect(node.inputs[0]);
  }
};
function nodeShowOutputs (node) {
  nodeBringToTop(node);
  if (node.outsShown) { return; }
  for( var i=0; i<node.parent.nodes.length; i++ ) {
    var n = node.parent.nodes[i];
    if (n!==node) {
      // Hide others
      nodeHideOutputs(n);
    }
  }
  // Show this
  node.view.classList.add("show-outs");
  node.outsShown = true;
  // Activate 1st
  if (node.outputs[0] != null) {
    portSelect(node.outputs[0]);
  }
};
function nodeHideInputs (node) {
  node.view.classList.remove("show-ins");
  node.insShown = false;
};
function nodeHideOutputs (node) {
  node.view.classList.remove("show-outs");
  node.outsShown = false;
};
function graphHidePorts (graph) {
  for( var i=0; i<graph.nodes.length; i++ ) {
    var n = graph.nodes[i];
    nodeHideInputs(n);
    nodeHideOutputs(n);
  }
};
function portSelect (port) {
  var sibs;
  if (port.type === "input") {
    sibs = port.parent.inputs;
  }
  else {
    sibs = port.parent.outputs;
  }
  var len = sibs.length;
  // Reset all
  for (var i=0; i<len; i++) {
    var p = sibs[i];
    if (i===port.id) {
      // Select this
      p.view.classList.add("active");
    } else {
      // Deselect others
      p.view.classList.remove("active");
    }
  }
};

// Moving helpers

function nodeSnapToGrid (node, x, y) {
  x = Math.floor( x / gridW );
  y = Math.floor( y / gridH );
  if (x !== node.x || y !== node.y) {
    node.x = x;
    node.y = y;
    translateGrid(node.view, x, y);
  }
};


// Debug
window.n = nodes;



})()
