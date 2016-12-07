/*global $,generateCombinedOptionControl,generateSelectOptionControl,PointUnitOptionControl*/

var fonts = ["serif", "sans-serif", "cursive", "fantasy", "monospace"];

var FontOptionControl = generateCombinedOptionControl([
    {"name": "family", "width": "80%", "control": generateSelectOptionControl(fonts.map(function (_font) {"use strict"; return {"value": _font, "label": _font}; }))},
    {"name": "size", "width": "20%", "control": PointUnitOptionControl},
]);
