/*global $,StaticAxis,DistinctAxis,NoneAxis*/

var axes = [
    {"label": "Single", "type": "static", "handler": StaticAxis, "limit": false},
    {"label": "Multiple", "type": "distinct", "handler": DistinctAxis},
    {"label": "None", "type": "static", "handler": NoneAxis, "limit": false}
];
