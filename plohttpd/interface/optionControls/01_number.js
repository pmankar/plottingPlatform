/*jslint browser: true*/
/*global d3,generateTextOptionControl*/

function generateNumberOptionControl(_appendix, scale) {
    "use strict";

    return generateTextOptionControl(_appendix, {
        "display2value": function (_display) {return scale(isNaN(_display) ? 0 : window.parseFloat(_display)); },
        "value2display": function (_value) {return isNaN(_value) ? 0 : scale.invert(_value); }
    });
}

// Value on prauschers laptop. Maybe representative, maybe not.
var _dpi = 96;

var NumberOptionControl = generateNumberOptionControl("", d3.scale.identity());
var PercentOptionControl = generateNumberOptionControl("%", d3.scale.linear().domain([0, 100]).range([0, 1]));
var DistanceOptionControl = generateNumberOptionControl("mm", d3.scale.linear().domain([0, 1]).range([0, _dpi / 25.4]));
var PointUnitOptionControl = generateNumberOptionControl("pt", d3.scale.linear().domain([0, 1]).range([0, _dpi / 72]));
