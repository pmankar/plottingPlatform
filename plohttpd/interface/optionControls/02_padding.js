/*global generateCombinedOptionControl,DistanceOptionControl*/

var PaddingOptionControl = generateCombinedOptionControl([
    {"name": "top", "width": "25%", "control": DistanceOptionControl},
    {"name": "right", "width": "25%", "control": DistanceOptionControl},
    {"name": "bottom", "width": "25%", "control": DistanceOptionControl},
    {"name": "left", "width": "25%", "control": DistanceOptionControl},
]);
