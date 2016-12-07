/*jslint browser: true*/
/*global visualisation,d3,D3_xy,D3_legend,getLabels,MarkerOptionControl,generateArrayOptionControl,TextOptionControl,PositionOptionControl*/

var defaultMarkers = [
    {"color": "#005AA9", "marker": "v", "size": 3},
    {"color": "#F5A300", "marker": "D", "size": 3},
    {"color": "#009D81", "marker": "o", "size": 3},
    {"color": "#E6001A", "marker": "^", "size": 3},
    {"color": "#A60084", "marker": "s", "size": 3},
    {"color": "green", "marker": "|", "size": 3},
];

visualisation.register({
    name: "Time",
    optionControls : function () {
        "use strict";

        return [
            {"label": "XY", "name": "xy", "controls": D3_xy.optionControls()},
            {"label": "Legend", "name": "legend", "controls": D3_legend.optionControls()},
            {"label": "Time", "name": "timePlot", "controls": [
                {"label": "Markers", "name": "markers", "control": new (generateArrayOptionControl(MarkerOptionControl))(defaultMarkers)},
                {"label": "X-Label", "name": "xlabel", "control": new TextOptionControl("time")},
                {"label": "Titel", "name": "titel", "control": new TextOptionControl("Titel")},
            ]}
        ];
    },
    guard : function (result) {
        "use strict";

        return result.metrics.query !== undefined;
    },
    create: function (panel, result, options) {
        "use strict";

        var labels = getLabels(result.query).values;

        var names = labels.map(function (l) {return l.label; });

        var plot = new D3_xy(panel, options.xy);
        plot.xlabel(options.timePlot.xlabel);
        plot.ylabel(result.metrics.query.title);
        plot.titel(options.timePlot.titel);
        plot.add(new D3_legend(options.legend, names.map(function (_name, i) {return {"label": _name, "marker": options.timePlot.markers[i % options.timePlot.markers.length]}; })));

        var valueRange;
        if (result.metrics.query.valueRange !== null && false) {
            valueRange = result.metrics.query.valueRange;
        } else {
            valueRange = [
                d3.min(labels, function (l) {return d3.min(result.values[l.query].query.time, function (d) {return d.x; }); }),
                d3.max(labels, function (l) {return d3.max(result.values[l.query].query.time, function (d) {return d.x; }); })
            ];
        }

        var x_scale = d3.scale.linear()
            .domain(valueRange)
            .range([0, plot.width]);
        plot.xscale(x_scale);

        var y_scale = d3.scale.linear()
            .domain([
                d3.min(labels, function (l) {return d3.min(result.values[l.query].query.time, function (d) {return d.y; }); }),
                d3.max(labels, function (l) {return d3.max(result.values[l.query].query.time, function (d) {return d.y; }); })
            ])
            .range([plot.height, 0])
            .nice(5);
        plot.yscale(y_scale);

        plot.cursorValues(x_scale, y_scale);

        // Dots
        labels.forEach(function (l, i) {
            var _marker = options.timePlot.markers[i % options.timePlot.markers.length];
            var _polygon = MarkerOptionControl.lookupMarkerCode(_marker.marker);
            plot.append("g")
                .selectAll(_polygon.svgElement)
                .data(result.values[l.query].query.time)
                .enter()
                .append(_polygon.svgElement)
                .attr("cx", function (d) {return x_scale(d.x); })
                .attr("cy", function (d) {return y_scale(d.y); })
                .attr("r", _marker.size)
                .attr("points", function (d) {
                    if (_polygon.edges === undefined) {
                        return "";
                    }
                    var _value = function (_attr) {return window.parseFloat(d3.select(this).attr(_attr)); }.bind(this);
                    return _polygon.edges.map(function (p) {return (_value("cx") + p[0] * _value("r")) + "," + (_value("cy") + p[1] * _value("r")); }).join(" ");
                })
                .style("fill", _marker.color)
                .style("stroke", "black")
                .style("stroke-width", 1);
        });
    }
});
