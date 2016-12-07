/*global D3_xy,generateSelectOptionControl,generateConditionalOptionControl,generateCombinedOptionControl,PercentOptionControl,StaticOptionControl,PositionOptionControl*/

var _compass = [
    {"value": "n", "label": "North", "position": [0.5, 0]},
    {"value": "ne", "label": "North-East", "position": [1, 0]},
    {"value": "e", "label": "East", "position": [1, 0.5]},
    {"value": "se", "label": "South-East", "position": [1, 1]},
    {"value": "s", "label": "South", "position": [0.5, 1]},
    {"value": "sw", "label": "South-West", "position": [0, 1]},
    {"value": "w", "label": "West", "position": [0, 0.5]},
    {"value": "nw", "label": "North-West", "position": [0, 0]},
];

var CompassOptionControl = generateCombinedOptionControl([
    {"name": "position", "width": "70%", "control": generateSelectOptionControl(_compass)},
    {"name": "margin", "width": "30%", "control": PercentOptionControl},
]);

var LegendPositionOptionControl = generateConditionalOptionControl("30%", "70%", [
    {"label": "None", "value": "none", "slave": StaticOptionControl},
    {"label": "Inner", "value": "inner", "slave": CompassOptionControl},
    {"label": "Outer", "value": "outer", "slave": CompassOptionControl},
    {"label": "Absolute", "value": "absolute", "slave": PositionOptionControl},
]);

LegendPositionOptionControl.lookupPosition = function (_value, _panel) {
    "use strict";

    if (_value.master === "none") {
        return null;
    }
    if (_value.master === "absolute") {
        return {
            "x": _value.slave.x,
            "y": _value.slave.y,
            "dx": 0,
            "dy": 0,
        };
    }

    var _orientation;
    if (_value.master === "inner" || (_value.master === "outer" && !(_panel instanceof D3_xy))) {
        _orientation = 1;
    }
    if (_value.master === "outer") {
        _orientation = 0;
    }

    var _coords;
    if (_panel instanceof D3_xy) {
        _coords = {"x": _panel.padding_left, "y": _panel.padding_top, "w": _panel.width, "h": _panel.height};
    } else {
        _coords = {"x": 0, "y": 0, "w": _panel.width, "h": _panel.height};
    }

    var _position = _compass[_compass.map(function (_c) {return _c.value; }).indexOf(_value.slave.position)].position;
    return {
        "x": _coords.x + _position[0] * _coords.w,
        "y": _coords.y + _position[1] * _coords.h,
        // 0    0.5    1
        "dx": (_position[0] === 0) ? (_orientation - 1 + _value.slave.margin * (_orientation - 0.5) * 2) : (_position[0] === 0.5) ? -0.5 : (-1) * (_orientation + _value.slave.margin * (_orientation - 0.5) * 2),
        "dy": (_position[1] === 0) ? (_orientation - 1 + _value.slave.margin * (_orientation - 0.5) * 2) : (_position[1] === 0.5) ? -0.5 : (-1) * (_orientation + _value.slave.margin * (_orientation - 0.5) * 2),
    };
};
