/*global generateCombinedOptionControl,DistanceOptionControl*/

var PositionOptionControl = generateCombinedOptionControl([
    {"name": "x", "width": "50%", "control": DistanceOptionControl},
    {"name": "y", "width": "50%", "control": DistanceOptionControl},
]);
