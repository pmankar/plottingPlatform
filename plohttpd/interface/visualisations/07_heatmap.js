/*jslint browser: true*/
/*global visualisation,d3,getLabels,D3_xy,D3_legend,ColorOptionControl,generateArrayOptionControl,TextOptionControl,NumberOptionControl,PositionOptionControl*/

visualisation.register({
    name: "Heatmap",
    optionControls : function () {
        "use strict";

        return [
            {"label": "XY", "name": "xy", "controls": D3_xy.optionControls()},
            {"label": "Legend", "name": "legend", "controls": D3_legend.optionControls()},
            {"label": "Heatmap", "name": "heatmap", "controls": [
                {"label": "Colors", "name": "colors", "control": new (generateArrayOptionControl(ColorOptionControl))(["#0a0", "#6c0", "#ee0", "#eb4", "#eb9", "#fff"])},
                {"label": "X-Label", "name": "xlabel", "control": new TextOptionControl("time")},
                {"label": "X-Bins", "name": "xbins", "control": new NumberOptionControl(20)},
                {"label": "Y-Bins", "name": "ybins", "control": new NumberOptionControl(3)},
                {"label": "Titel", "name": "titel", "control": new TextOptionControl("Titel")},
            ]}
        ];
    },
    guard : function (result) {
        "use strict";

        return result.metrics.query !== undefined && result.metrics.sort !== undefined;
    },
    create: function (panel, result, options) {
        "use strict";

        var _l = getLabels(result.query);
        var axis = _l.axis;
        var labels = _l.values;

        var plot = new D3_xy(panel, options.xy);

        var values = [];
        labels.forEach(function (_label) {
            result.values[_label.query].query.time.forEach(function (d) {
                values.push({"x": d.x, "y": result.values[_label.query].sort.aggregated.avg, "z": d.y});
            });
        });

        var xRange = d3.extent(values, function (v) {return v.x; });
        var yRange = d3.extent(values, function (v) {return v.y; });
        // var zRange = d3.extent(values, function (v) {return v.z; });

        var choose_xbucket = d3.scale.linear().domain(xRange).range([0, options.heatmap.xbins]);
        var choose_ybucket = d3.scale.linear().domain(yRange).range([0, options.heatmap.ybins]);
        var buckets = [];
        var x, y;
        for (y = 0; y < options.heatmap.ybins; y = y + 1) {
            buckets[y] = [];
            for (x = 0; x < options.heatmap.xbins; x = x + 1) {
                buckets[y][x] = [];
            }
        }
        values.forEach(function (d) {
            var xbucket = window.Math.min(window.Math.floor(choose_xbucket(d.x)), options.heatmap.xbins - 1);
            var ybucket = window.Math.min(window.Math.floor(choose_ybucket(d.y)), options.heatmap.ybins - 1);
            buckets[ybucket][xbucket].push(d);
        });
        buckets.forEach(function (yb, y) {
            yb.forEach(function (xyb, x) {
                // TODO maybe put heigher weight on values which are more centered. or something.
                buckets[y][x] = buckets[y][x].reduce(function (pv, cv) {return pv + cv.z / buckets[y][x].length; }, 0);
            });
        });

        var zRange = [
            d3.min(buckets, function (b) {return d3.min(b); }),
            d3.max(buckets, function (b) {return d3.max(b); })
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
            .domain(yRange)
            .range([plot.height, 0]);

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

        buckets.forEach(function (_yb, y) {
            plot.append("g").selectAll("rect")
                .data(_yb)
                .enter()
                .append("rect")
                .attr("x", function (d, x) {
                    return x * (plot.width / buckets[y].length);
                })
                .attr("y", plot.height - (y + 1) * (plot.height / buckets.length))
                .attr("width", plot.width / buckets[y].length)
                .attr("height", plot.height / buckets.length)
                .style("fill", function (d) {
                    return zScale(d);
                });
        });
    }
});
