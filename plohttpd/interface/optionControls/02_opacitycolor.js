/*global generateCombinedOptionControl,ColorOptionControl,PercentOptionControl*/

var OpacityColorOptionControl = generateCombinedOptionControl([
    {"name": "color", "width": "70%", "control": ColorOptionControl},
    {"name": "opacity", "width": "30%", "control": PercentOptionControl},
]);

