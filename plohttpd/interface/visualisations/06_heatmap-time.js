/*jslint browser: true*/
/*global visualisation,d3,getLabels,D3_xy,D3_legend,ColorOptionControl,generateArrayOptionControl,TextOptionControl,NumberOptionControl,PositionOptionControl*/

visualisation.register({
    name: "Heatmap (Time)",
    optionControls : function () {
        "use strict";

        return [
            {"label": "XY", "name": "xy", "controls": D3_xy.optionControls()},
            {"label": "Legend", "name": "legend", "controls": D3_legend.optionControls()},
            {"label": "Heatmap", "name": "heatmap", "controls": [
                {"label": "Colors", "name": "colors", "control": new (generateArrayOptionControl(ColorOptionControl))(["#0a0", "#6c0", "#ee0", "#eb4", "#eb9", "#fff"])},
                {"label": "X-Label", "name": "xlabel", "control": new TextOptionControl("time")},
                {"label": "Bins", "name": "bins", "control": new NumberOptionControl(20)},
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

        var _l = getLabels(result.query);
        var axis = _l.axis;
        var labels = _l.values;
        var names = labels.map(function (l) {return l.label; });

        var plot = new D3_xy(panel, options.xy);

        var xRange = [
            d3.min(labels, function (l) {return d3.min(result.values[l.query].query.time, function (d) {return d.x; }); }),
            d3.max(labels, function (l) {return d3.max(result.values[l.query].query.time, function (d) {return d.x; }); })
        ];

        var choose_bucket = d3.scale.linear().domain(xRange).range([0, options.heatmap.bins]);
        labels.forEach(function (_label) {
            _label.buckets = [];
            var i;
            for (i = 0; i < options.heatmap.bins; i = i + 1) {
                _label.buckets[i] = {"x": xRange[0] + i * (xRange[1] - xRange[0]) / options.heatmap.bins, "y": 0, "values": []};
            }

            result.values[_label.query].query.time.forEach(function (d) {
                var bucket = window.Math.min(window.Math.floor(choose_bucket(d.x)), options.heatmap.bins - 1);
                _label.buckets[bucket].values.push(d);
            });
            _label.buckets.forEach(function (_bucket) {
                // TODO maybe put heigher weight on values which are more centered. or something.
                _bucket.y = _bucket.values.reduce(function (pv, cv) {return pv + cv.y / _bucket.values.length; }, 0);
            });
        });

        var zRange = [
            d3.min(labels, function (l) {return d3.min(l.buckets, function (d) {return d.y; }); }),
            d3.max(labels, function (l) {return d3.max(l.buckets, function (d) {return d.y; }); })
        ];

        //Determine range for z value
        var stepZ = (zRange[1] - zRange[0]) / (options.heatmap.colors.length - 1);
        var steps = [];
        var i = 0;
        for (i = 0; i < options.heatmap.colors.length; i = i + 1) {
            steps.push(zRange[0] + i * stepZ);
        }

        var xScale = d3.scale.linear()
            .domain(xRange)
            .range([0, plot.width]);

        var yScale = d3.scale.ordinal()
            .domain(names)
            .rangeBands([plot.height, 0]);

        var zScale = d3.scale.linear()
            .domain(steps)
            .range(options.heatmap.colors);

        plot.xscale(xScale);
        plot.yscale(yScale);
        plot.xlabel(options.heatmap.xlabel);
        plot.ylabel(axis);
        plot.titel(options.heatmap.titel);
        plot.cursorValues(xScale, yScale);
        plot.add(new D3_legend(options.legend, steps.map(function (_step) {return {"label": _step, "color": zScale(_step)}; })));

        labels.forEach(function (_label) {
            plot.append("g").selectAll("rect")
                .data(_label.buckets)
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return xScale(d.x);
                })
                .attr("y", function (d) {
                    return yScale(_label.label);
                })
                .attr("width", plot.width / _label.buckets.length)
                .attr("height", plot.height / labels.length)
                .style("fill", function (d) {
                    return zScale(d.y);
                });
        });

    }
});
