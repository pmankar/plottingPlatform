/*jslint browser: true*/
/*global $,generateCombinedOptionControl,ColorOptionControl,DistanceOptionControl,generateSelectOptionControl*/

function generateRegularPolygon(radians, offset) {
    "use strict";

    return radians.map(function (r, i) {
        var rad = (i + offset) / radians.length * 2 * window.Math.PI;
        return [window.Math.sin(rad) * r, window.Math.cos(rad) * r];
    });
}

var markerTypes = [
    {"code": "o", "label": "Circle", "svgElement": "circle"},
    {"code": "v", "label": "Triangle down", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1, 1], 0.00)},
    {"code": "^", "label": "Triangle up", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1, 1], 1.50)},
    {"code": "<", "label": "Triangle left", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1, 1], 2.25)},
    {"code": ">", "label": "Triangle right", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1, 1], 0.75)},
    {"code": "8", "label": "Octagon", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1, 1, 1, 1, 1, 1, 1], 0)},
    {"code": "s", "label": "Square", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1, 1, 1], 0.5)},
    {"code": "p", "label": "Pentagon", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1, 1, 1, 1], 0)},
    {"code": "*", "label": "Star", "svgElement": "polygon", "edges": generateRegularPolygon([1, 0.4, 1, 0.4, 1, 0.4, 1, 0.4, 1, 0.4], 0)},
    {"code": "x", "label": "X", "svgElement": "polygon", "edges": generateRegularPolygon([0, 1, 0, 1, 0, 1, 0, 1], 0)},
    {"code": "D", "label": "Diamond", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1, 1, 1], 0)},
    {"code": "|", "label": "Vertical Line", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1], 0)},
    {"code": "_", "label": "Horizontal Line", "svgElement": "polygon", "edges": generateRegularPolygon([1, 1], 0.5)},
];

var MarkerOptionControl = generateCombinedOptionControl([
    {"width": "40%", "name": "color", "control": ColorOptionControl},
    {"width": "20%", "name": "size", "control": DistanceOptionControl},
    {"width": "40%", "name": "marker", "control": generateSelectOptionControl(markerTypes.map(function (_marker) {"use strict"; return {"value": _marker.code, "label": _marker.label}; }))},
]);

MarkerOptionControl.lookupMarkerCode = function (_code) {
    "use strict";

    return markerTypes[markerTypes.map(function (_marker) {return _marker.code; }).indexOf(_code)];
};
