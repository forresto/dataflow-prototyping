loadGraph({
  "id": "ti6yn",
  "project": "",
  "properties": {
    "name": "photobooth",
    "environment": {
      "runtime": "html",
      "src": "preview/iframe.html",
      "width": 300,
      "height": 300,
      "content": "    <video id=\"vid\" autoplay loop width=\"640\" height=\"480\" style=\"display:none;\"></video>\n    <canvas id=\"out\" width=\"640\" height=\"480\" style=\"max-width:100%;\"></canvas>\n\n<input id=\"slider\" type=\"range\" min=\"0\" max=\"1\" value=\"0.5\" step=\"0.01\"></input>\n    <button id=\"start\">start camera</button>\n    <button id=\"prev\">prev</button>\n    <button id=\"next\">next</button>\n    <button id=\"save\">save</button>\n\n<style>\n  #saved img { width: 160px; height: 120px;}\n</style>\n<div id=\"saved\"></div>"
    }
  },
  "exports": [],
  "groups": [
    {
      "name": "elements", 
      "nodes": ["dom/GetElement_ah82a", "dom/GetElement_f4nkd", "dom/GetElement_z64xf"],
      "metadata": {
        "description": "get the elements from the dom"
      }
    },
    {
      "name": "countdown",
      "nodes": ["core/Split_lbwyz", "interaction/ListenMouse_1u0rk", "strings/SendString_zry4n", "core/RunTimeout_3wulz", "dom/AddClass_9rihj", "core/Split_ho5ib", "strings/SendString_lnf0z", "core/Kick_7efi8", "dom/RemoveClass_ec7ug"],
      "metadata": {
        "description": ""
      }
    },
    {
      "name": "changefilter",
      "nodes": ["dom/GetElement_e16dy", "dom/GetElement_85so0", "interaction/ListenMouse_bil4d", "interaction/ListenMouse_aii7r"],
      "metadata": {
        "description": ""
      }
    },
    {
      "name": "save",
      "nodes": ["dom/GetElement_ah36i", "core/MakeFunction_t17n", "core/Split_xyb8x", "strings/SendString_7g9h8", "dom/GetElement_4houj", "core/RepeatAsync_grqs3", "dom/CreateElement_sf6ec", "dom/SetAttribute_3bmlw"],
      "metadata": {
        "description": ""
      }
    },
    {
      "name": "filter",
      "nodes": ["dom/GetElement_j674o", "routers/KickRouter_bzaiw", "interaction/ListenChange_z7m5u", "math/Multiply_rbxrn", "math/Multiply_3v13k", "seriously/HueSaturation_bzfvt", "core/Split_jx318", "math/Multiply_3eldx", "seriously/TVGlitch_e1qre", "seriously/Hex_lx162", "seriously/Ascii_17c9q", "seriously/Invert_7xnl3", "seriously/Edge_egmkb", "seriously/Split_7oj15", "seriously/SetTarget_kii7s"],
      "metadata": {
        "description": ""
      }
    }
  ],
  "processes": {
    "dom/GetElement_f4nkd": {
      "component": "dom/GetElement",
      "metadata": {
        "x": 324,
        "y": 144,
        "label": "startButton"
      }
    },
    "interaction/ListenMouse_1w3vt": {
      "component": "interaction/ListenMouse",
      "metadata": {
        "x": 324,
        "y": 288,
        "label": "clickStart"
      }
    },
    "gum/GetUserMedia_9e9i4": {
      "component": "gum/GetUserMedia",
      "metadata": {
        "x": 324,
        "y": 648,
        "label": "webCam"
      }
    },
    "dom/GetElement_z64xf": {
      "component": "dom/GetElement",
      "metadata": {
        "x": 504,
        "y": 144,
        "label": "videoEl"
      }
    },
    "dom/SetAttribute_uto4k": {
      "component": "dom/SetAttribute",
      "metadata": {
        "x": 432,
        "y": 648,
        "label": "setVideoSrc"
      }
    },
    "seriously/SetSource_szf33": {
      "component": "seriously/SetSource",
      "metadata": {
        "x": 576,
        "y": 648,
        "label": "setFilterSource"
      }
    },
    "seriously/Ascii_17c9q": {
      "component": "seriously/Ascii",
      "metadata": {
        "x": 1080,
        "y": 396,
        "label": "seriously/Ascii"
      }
    },
    "dom/GetElement_ah82a": {
      "component": "dom/GetElement",
      "metadata": {
        "x": 1404,
        "y": 144,
        "label": "canvasEl"
      }
    },
    "seriously/SetTarget_kii7s": {
      "component": "seriously/SetTarget",
      "metadata": {
        "x": 1404,
        "y": 648,
        "label": "filterTarget"
      }
    },
    "dom/GetElement_85so0": {
      "component": "dom/GetElement",
      "metadata": {
        "x": 720,
        "y": 144,
        "label": "prevButton"
      }
    },
    "interaction/ListenMouse_aii7r": {
      "component": "interaction/ListenMouse",
      "metadata": {
        "x": 720,
        "y": 288,
        "label": "clickPrev"
      }
    },
    "dom/GetElement_e16dy": {
      "component": "dom/GetElement",
      "metadata": {
        "x": 864,
        "y": 144,
        "label": "nextButton"
      }
    },
    "interaction/ListenMouse_bil4d": {
      "component": "interaction/ListenMouse",
      "metadata": {
        "x": 864,
        "y": 288,
        "label": "clickNext"
      }
    },
    "routers/KickRouter_bzaiw": {
      "component": "routers/KickRouter",
      "metadata": {
        "x": 828,
        "y": 648,
        "label": "chooseFilter"
      }
    },
    "seriously/TVGlitch_e1qre": {
      "component": "seriously/TVGlitch",
      "metadata": {
        "x": 1080,
        "y": 504,
        "label": "seriously/TVGlitch"
      }
    },
    "seriously/Hex_lx162": {
      "component": "seriously/Hex",
      "metadata": {
        "x": 1008,
        "y": 612,
        "label": "seriously/Hex"
      }
    },
    "seriously/Edge_egmkb": {
      "component": "seriously/Edge",
      "metadata": {
        "x": 1152,
        "y": 612,
        "label": "seriously/Edge"
      }
    },
    "seriously/Invert_7xnl3": {
      "component": "seriously/Invert",
      "metadata": {
        "x": 1008,
        "y": 828,
        "label": "negative"
      }
    },
    "seriously/Split_7oj15": {
      "component": "seriously/Split",
      "metadata": {
        "x": 1152,
        "y": 756,
        "label": "halfScreen"
      }
    },
    "core/Split_jx318": {
      "component": "core/Split",
      "metadata": {
        "x": 1008,
        "y": 720,
        "label": "core/Split"
      }
    },
    "core/Split_occbw": {
      "component": "core/Split",
      "metadata": {
        "x": 684,
        "y": 648,
        "label": "core/Split"
      }
    },
    "core/Split_y0bla": {
      "component": "core/Split",
      "metadata": {
        "x": 504,
        "y": 468,
        "label": "core/Split"
      }
    },
    "seriously/HueSaturation_bzfvt": {
      "component": "seriously/HueSaturation",
      "metadata": {
        "x": 1080,
        "y": 972,
        "label": "seriously/HueSaturation"
      }
    },
    "core/Split_jzzu2": {
      "component": "core/Split",
      "metadata": {
        "x": 1404,
        "y": 288,
        "label": "core/Split"
      }
    },
    "core/Kick_7efi8": {
      "component": "core/Kick",
      "metadata": {
        "x": 1476,
        "y": 792,
        "label": "sendCanvas"
      }
    },
    "core/MakeFunction_t17n": {
      "component": "core/MakeFunction",
      "metadata": {
        "x": 1296,
        "y": 936,
        "label": "canvasToJPEG"
      }
    },
    "dom/GetElement_ah36i": {
      "component": "dom/GetElement",
      "metadata": {
        "x": 1584,
        "y": 144,
        "label": "saveButton"
      }
    },
    "interaction/ListenMouse_1u0rk": {
      "component": "interaction/ListenMouse",
      "metadata": {
        "x": 1584,
        "y": 288,
        "label": "clickSave"
      }
    },
    "dom/CreateElement_sf6ec": {
      "component": "dom/CreateElement",
      "metadata": {
        "x": 1584,
        "y": 1008,
        "label": "dom/CreateElement"
      }
    },
    "dom/SetAttribute_3bmlw": {
      "component": "dom/SetAttribute",
      "metadata": {
        "x": 1584,
        "y": 1152,
        "label": "dom/SetAttribute"
      }
    },
    "core/RepeatAsync_grqs3": {
      "component": "core/RepeatAsync",
      "metadata": {
        "x": 1440,
        "y": 1152,
        "label": "core/RepeatAsync"
      }
    },
    "dom/GetElement_4houj": {
      "component": "dom/GetElement",
      "metadata": {
        "x": 1584,
        "y": 792,
        "label": "savedEl"
      }
    },
    "core/Split_xyb8x": {
      "component": "core/Split",
      "metadata": {
        "x": 1296,
        "y": 1080,
        "label": "core/Split"
      }
    },
    "strings/SendString_7g9h8": {
      "component": "strings/SendString",
      "metadata": {
        "x": 1440,
        "y": 1008,
        "label": "strings/SendString"
      }
    },
    "core/RepeatAsync_647ff": {
      "component": "core/RepeatAsync",
      "metadata": {
        "x": 612,
        "y": 792,
        "label": "core/RepeatAsync"
      }
    },
    "core/Kick_4njgs": {
      "component": "core/Kick",
      "metadata": {
        "x": 756,
        "y": 792,
        "label": "kickFirstFilter"
      }
    },
    "dom/GetElement_j674o": {
      "component": "dom/GetElement",
      "metadata": {
        "x": 432,
        "y": 1044,
        "label": "sliderEl"
      }
    },
    "interaction/ListenChange_z7m5u": {
      "component": "interaction/ListenChange",
      "metadata": {
        "x": 612,
        "y": 1044,
        "label": "slid"
      }
    },
    "math/Multiply_3eldx": {
      "component": "math/Multiply",
      "metadata": {
        "x": 828,
        "y": 1152,
        "label": "x2xPI"
      }
    },
    "math/Multiply_3v13k": {
      "component": "math/Multiply",
      "metadata": {
        "x": 828,
        "y": 1044,
        "label": "tenth"
      }
    },
    "math/Multiply_rbxrn": {
      "component": "math/Multiply",
      "metadata": {
        "x": 828,
        "y": 936,
        "label": "tenth"
      }
    },
    "core/RunTimeout_3wulz": {
      "component": "core/RunTimeout",
      "metadata": {
        "x": 1584,
        "y": 432,
        "label": "core/RunTimeout"
      }
    },
    "core/Split_ho5ib": {
      "component": "core/Split",
      "metadata": {
        "x": 1584,
        "y": 576,
        "label": "core/Split"
      }
    },
    "dom/AddClass_9rihj": {
      "component": "dom/AddClass",
      "metadata": {
        "x": 1836,
        "y": 360,
        "label": "dom/AddClass"
      }
    },
    "core/Split_lbwyz": {
      "component": "core/Split",
      "metadata": {
        "x": 1728,
        "y": 144,
        "label": "core/Split"
      }
    },
    "dom/RemoveClass_ec7ug": {
      "component": "dom/RemoveClass",
      "metadata": {
        "x": 1836,
        "y": 648,
        "label": "dom/RemoveClass"
      }
    },
    "strings/SendString_zry4n": {
      "component": "strings/SendString",
      "metadata": {
        "x": 1728,
        "y": 360,
        "label": "countdown"
      }
    },
    "strings/SendString_lnf0z": {
      "component": "strings/SendString",
      "metadata": {
        "x": 1728,
        "y": 648,
        "label": "countdown"
      }
    }
  },
  "connections": [
    {
      "src": {
        "process": "dom/GetElement_f4nkd",
        "port": "element"
      },
      "tgt": {
        "process": "interaction/ListenMouse_1w3vt",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "interaction/ListenMouse_1w3vt",
        "port": "click"
      },
      "tgt": {
        "process": "gum/GetUserMedia_9e9i4",
        "port": "start"
      },
      "metadata": {
        "route": "9"
      }
    },
    {
      "src": {
        "process": "gum/GetUserMedia_9e9i4",
        "port": "url"
      },
      "tgt": {
        "process": "dom/SetAttribute_uto4k",
        "port": "value"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "seriously/Ascii_17c9q",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/SetTarget_kii7s",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "dom/GetElement_85so0",
        "port": "element"
      },
      "tgt": {
        "process": "interaction/ListenMouse_aii7r",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "dom/GetElement_e16dy",
        "port": "element"
      },
      "tgt": {
        "process": "interaction/ListenMouse_bil4d",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "interaction/ListenMouse_aii7r",
        "port": "click"
      },
      "tgt": {
        "process": "routers/KickRouter_bzaiw",
        "port": "prev"
      },
      "metadata": {
        "route": "9"
      }
    },
    {
      "src": {
        "process": "interaction/ListenMouse_bil4d",
        "port": "click"
      },
      "tgt": {
        "process": "routers/KickRouter_bzaiw",
        "port": "next"
      },
      "metadata": {
        "route": "9"
      }
    },
    {
      "src": {
        "process": "seriously/TVGlitch_e1qre",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/SetTarget_kii7s",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "routers/KickRouter_bzaiw",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/Hex_lx162",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "seriously/Edge_egmkb",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/SetTarget_kii7s",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "seriously/Hex_lx162",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/Edge_egmkb",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "routers/KickRouter_bzaiw",
        "port": "out"
      },
      "tgt": {
        "process": "core/Split_jx318",
        "port": "in"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "core/Split_jx318",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/Invert_7xnl3",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "seriously/Split_7oj15",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/SetTarget_kii7s",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "seriously/SetSource_szf33",
        "port": "out"
      },
      "tgt": {
        "process": "core/Split_occbw",
        "port": "in"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "core/Split_occbw",
        "port": "out"
      },
      "tgt": {
        "process": "routers/KickRouter_bzaiw",
        "port": "in"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "dom/GetElement_z64xf",
        "port": "element"
      },
      "tgt": {
        "process": "core/Split_y0bla",
        "port": "in"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/Split_y0bla",
        "port": "out"
      },
      "tgt": {
        "process": "dom/SetAttribute_uto4k",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/Split_y0bla",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/SetSource_szf33",
        "port": "source"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "routers/KickRouter_bzaiw",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/HueSaturation_bzfvt",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "seriously/HueSaturation_bzfvt",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/SetTarget_kii7s",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "dom/GetElement_ah82a",
        "port": "element"
      },
      "tgt": {
        "process": "core/Split_jzzu2",
        "port": "in"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/Split_jzzu2",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/SetTarget_kii7s",
        "port": "target"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/Split_jzzu2",
        "port": "out"
      },
      "tgt": {
        "process": "core/Kick_7efi8",
        "port": "data"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/Kick_7efi8",
        "port": "out"
      },
      "tgt": {
        "process": "core/MakeFunction_t17n",
        "port": "in"
      },
      "metadata": {
        "route": 0
      }
    },
    {
      "src": {
        "process": "core/Split_jx318",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/Split_7oj15",
        "port": "sourcea"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "seriously/Invert_7xnl3",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/Split_7oj15",
        "port": "sourceb"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "dom/CreateElement_sf6ec",
        "port": "element"
      },
      "tgt": {
        "process": "dom/SetAttribute_3bmlw",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "dom/GetElement_4houj",
        "port": "element"
      },
      "tgt": {
        "process": "dom/CreateElement_sf6ec",
        "port": "container"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/RepeatAsync_grqs3",
        "port": "out"
      },
      "tgt": {
        "process": "dom/SetAttribute_3bmlw",
        "port": "value"
      },
      "metadata": {
        "route": 0
      }
    },
    {
      "src": {
        "process": "core/Split_xyb8x",
        "port": "out"
      },
      "tgt": {
        "process": "core/RepeatAsync_grqs3",
        "port": "in"
      },
      "metadata": {
        "route": 0
      }
    },
    {
      "src": {
        "process": "core/MakeFunction_t17n",
        "port": "out"
      },
      "tgt": {
        "process": "core/Split_xyb8x",
        "port": "in"
      },
      "metadata": {
        "route": 0
      }
    },
    {
      "src": {
        "process": "core/Split_xyb8x",
        "port": "out"
      },
      "tgt": {
        "process": "strings/SendString_7g9h8",
        "port": "in"
      },
      "metadata": {
        "route": 0
      }
    },
    {
      "src": {
        "process": "strings/SendString_7g9h8",
        "port": "out"
      },
      "tgt": {
        "process": "dom/CreateElement_sf6ec",
        "port": "tagname"
      },
      "metadata": {
        "route": "3"
      }
    },
    {
      "src": {
        "process": "core/Split_occbw",
        "port": "out"
      },
      "tgt": {
        "process": "core/RepeatAsync_647ff",
        "port": "in"
      },
      "metadata": {
        "route": "0"
      }
    },
    {
      "src": {
        "process": "core/RepeatAsync_647ff",
        "port": "out"
      },
      "tgt": {
        "process": "core/Kick_4njgs",
        "port": "in"
      },
      "metadata": {
        "route": 0
      }
    },
    {
      "src": {
        "process": "core/Kick_4njgs",
        "port": "out"
      },
      "tgt": {
        "process": "routers/KickRouter_bzaiw",
        "port": "index"
      },
      "metadata": {
        "route": 0
      }
    },
    {
      "src": {
        "process": "routers/KickRouter_bzaiw",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/Ascii_17c9q",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "routers/KickRouter_bzaiw",
        "port": "out"
      },
      "tgt": {
        "process": "seriously/TVGlitch_e1qre",
        "port": "source"
      },
      "metadata": {
        "route": "5"
      }
    },
    {
      "src": {
        "process": "dom/GetElement_j674o",
        "port": "element"
      },
      "tgt": {
        "process": "interaction/ListenChange_z7m5u",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "interaction/ListenChange_z7m5u",
        "port": "value"
      },
      "tgt": {
        "process": "math/Multiply_3eldx",
        "port": "multiplicand"
      },
      "metadata": {
        "route": "3"
      }
    },
    {
      "src": {
        "process": "math/Multiply_3eldx",
        "port": "product"
      },
      "tgt": {
        "process": "seriously/Split_7oj15",
        "port": "angle"
      },
      "metadata": {
        "route": "3"
      }
    },
    {
      "src": {
        "process": "interaction/ListenChange_z7m5u",
        "port": "value"
      },
      "tgt": {
        "process": "math/Multiply_3v13k",
        "port": "multiplicand"
      },
      "metadata": {
        "route": "3"
      }
    },
    {
      "src": {
        "process": "math/Multiply_3v13k",
        "port": "product"
      },
      "tgt": {
        "process": "seriously/Hex_lx162",
        "port": "size"
      },
      "metadata": {
        "route": "3"
      }
    },
    {
      "src": {
        "process": "interaction/ListenChange_z7m5u",
        "port": "value"
      },
      "tgt": {
        "process": "math/Multiply_rbxrn",
        "port": "multiplicand"
      },
      "metadata": {
        "route": "3"
      }
    },
    {
      "src": {
        "process": "math/Multiply_rbxrn",
        "port": "product"
      },
      "tgt": {
        "process": "seriously/TVGlitch_e1qre",
        "port": "distortion"
      },
      "metadata": {
        "route": "3"
      }
    },
    {
      "src": {
        "process": "interaction/ListenChange_z7m5u",
        "port": "value"
      },
      "tgt": {
        "process": "seriously/HueSaturation_bzfvt",
        "port": "hue"
      },
      "metadata": {
        "route": "3"
      }
    },
    {
      "src": {
        "process": "interaction/ListenMouse_1u0rk",
        "port": "click"
      },
      "tgt": {
        "process": "core/RunTimeout_3wulz",
        "port": "start"
      },
      "metadata": {
        "route": "9"
      }
    },
    {
      "src": {
        "process": "core/RunTimeout_3wulz",
        "port": "out"
      },
      "tgt": {
        "process": "core/Split_ho5ib",
        "port": "in"
      },
      "metadata": {
        "route": "0"
      }
    },
    {
      "src": {
        "process": "core/Split_ho5ib",
        "port": "out"
      },
      "tgt": {
        "process": "core/Kick_7efi8",
        "port": "in"
      },
      "metadata": {
        "route": "0"
      }
    },
    {
      "src": {
        "process": "dom/GetElement_ah36i",
        "port": "element"
      },
      "tgt": {
        "process": "core/Split_lbwyz",
        "port": "in"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/Split_lbwyz",
        "port": "out"
      },
      "tgt": {
        "process": "interaction/ListenMouse_1u0rk",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/Split_lbwyz",
        "port": "out"
      },
      "tgt": {
        "process": "dom/AddClass_9rihj",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "core/Split_lbwyz",
        "port": "out"
      },
      "tgt": {
        "process": "dom/RemoveClass_ec7ug",
        "port": "element"
      },
      "metadata": {
        "route": "10"
      }
    },
    {
      "src": {
        "process": "strings/SendString_zry4n",
        "port": "out"
      },
      "tgt": {
        "process": "dom/AddClass_9rihj",
        "port": "class"
      },
      "metadata": {
        "route": "0"
      }
    },
    {
      "src": {
        "process": "strings/SendString_lnf0z",
        "port": "out"
      },
      "tgt": {
        "process": "dom/RemoveClass_ec7ug",
        "port": "class"
      },
      "metadata": {
        "route": "0"
      }
    },
    {
      "src": {
        "process": "core/Split_ho5ib",
        "port": "out"
      },
      "tgt": {
        "process": "strings/SendString_lnf0z",
        "port": "in"
      },
      "metadata": {
        "route": "0"
      }
    },
    {
      "src": {
        "process": "interaction/ListenMouse_1u0rk",
        "port": "click"
      },
      "tgt": {
        "process": "strings/SendString_zry4n",
        "port": "in"
      },
      "metadata": {
        "route": "9"
      }
    },
    {
      "data": "#start",
      "tgt": {
        "process": "dom/GetElement_f4nkd",
        "port": "selector"
      }
    },
    {
      "data": "#vid",
      "tgt": {
        "process": "dom/GetElement_z64xf",
        "port": "selector"
      }
    },
    {
      "data": "src",
      "tgt": {
        "process": "dom/SetAttribute_uto4k",
        "port": "attribute"
      }
    },
    {
      "data": "#out",
      "tgt": {
        "process": "dom/GetElement_ah82a",
        "port": "selector"
      }
    },
    {
      "data": "#prev",
      "tgt": {
        "process": "dom/GetElement_85so0",
        "port": "selector"
      }
    },
    {
      "data": "#next",
      "tgt": {
        "process": "dom/GetElement_e16dy",
        "port": "selector"
      }
    },
    {
      "data": 0.01,
      "tgt": {
        "process": "seriously/Split_7oj15",
        "port": "fuzzy"
      }
    },
    {
      "data": "0.5",
      "tgt": {
        "process": "seriously/Split_7oj15",
        "port": "split"
      }
    },
    {
      "data": "0.25",
      "tgt": {
        "process": "seriously/HueSaturation_bzfvt",
        "port": "saturation"
      }
    },
    {
      "data": "return x.toDataURL(\"image/jpeg\", 0.85);",
      "tgt": {
        "process": "core/MakeFunction_t17n",
        "port": "function"
      }
    },
    {
      "data": "#save",
      "tgt": {
        "process": "dom/GetElement_ah36i",
        "port": "selector"
      }
    },
    {
      "data": "#saved",
      "tgt": {
        "process": "dom/GetElement_4houj",
        "port": "selector"
      }
    },
    {
      "data": "src",
      "tgt": {
        "process": "dom/SetAttribute_3bmlw",
        "port": "attribute"
      }
    },
    {
      "data": "img",
      "tgt": {
        "process": "strings/SendString_7g9h8",
        "port": "string"
      }
    },
    {
      "data": "0",
      "tgt": {
        "process": "core/Kick_4njgs",
        "port": "data"
      }
    },
    {
      "data": "#slider",
      "tgt": {
        "process": "dom/GetElement_j674o",
        "port": "selector"
      }
    },
    {
      "data": "6.283185",
      "tgt": {
        "process": "math/Multiply_3eldx",
        "port": "multiplier"
      }
    },
    {
      "data": 0.01,
      "tgt": {
        "process": "seriously/TVGlitch_e1qre",
        "port": "verticalsync"
      }
    },
    {
      "data": "0.04",
      "tgt": {
        "process": "seriously/TVGlitch_e1qre",
        "port": "linesync"
      }
    },
    {
      "data": 0.01,
      "tgt": {
        "process": "seriously/TVGlitch_e1qre",
        "port": "time"
      }
    },
    {
      "data": "0.01",
      "tgt": {
        "process": "seriously/TVGlitch_e1qre",
        "port": "bars"
      }
    },
    {
      "data": 0.15,
      "tgt": {
        "process": "seriously/TVGlitch_e1qre",
        "port": "scanlines"
      }
    },
    {
      "data": "0.1",
      "tgt": {
        "process": "math/Multiply_3v13k",
        "port": "multiplier"
      }
    },
    {
      "data": "0.1",
      "tgt": {
        "process": "math/Multiply_rbxrn",
        "port": "multiplier"
      }
    },
    {
      "data": "3000",
      "tgt": {
        "process": "core/RunTimeout_3wulz",
        "port": "time"
      }
    },
    {
      "data": "countdown",
      "tgt": {
        "process": "strings/SendString_zry4n",
        "port": "string"
      }
    },
    {
      "data": "countdown",
      "tgt": {
        "process": "strings/SendString_lnf0z",
        "port": "string"
      }
    }
  ]
})
