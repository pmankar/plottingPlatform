/*global $,generateCombinedOptionControl,DistanceOptionControl,ColorOptionControl*/

var StrokeOptionControl = generateCombinedOptionControl([
    {"name": "width", "width": "30%", "control": DistanceOptionControl},
    {"name": "color", "width": "40%", "control": ColorOptionControl},
]);
