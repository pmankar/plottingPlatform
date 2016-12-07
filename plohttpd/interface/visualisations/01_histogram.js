/*global visualisation,d3,D3_xy,ColorOptionControl,NumberOptionControl,TextOptionControl*/

visualisation.register({
    name: "Histogram",
    optionControls : function () {
        "use strict";

        return [
            {"label": "XY", "name": "xy", "controls": D3_xy.optionControls()},
            {"label": "Histogram", "name": "histogram", "controls": [
                {"label": "Titel", "name": "titel", "control": new TextOptionControl("Titel")},
                {"label": "Color", "name": "color", "control": new ColorOptionControl("steelblue")},
                {"label": "Bins", "name": "bins", "control": new NumberOptionControl(20)},
            ]}
        ];
    },
    guard : function (result) {
        "use strict";

        // Verify we only have one result
        return typeof result.query === "string" && result.metrics.query !== undefined;
    },
    create: function (panel, result, options) {
        "use strict";

        var data = result.values[result.query].query.per_host;
        var histogram = d3.layout.histogram().bins(options.histogram.bins)(data);

        var plot = new D3_xy(panel, options.xy);
        plot.titel(options.histogram.titel);
        plot.xlabel(result.metrics.query.title);

        var valueRange;
        if (result.metrics.query.valueRange !== null) {
            valueRange = result.metrics.query.valueRange;
        } else {
            valueRange = d3.extent(data);
        }

        var x_scale = d3.scale.linear()
            .domain(valueRange)
            .range([0, plot.width]);
        plot.xscale(x_scale);

        var y_scale = d3.scale.linear()
            .domain([0, d3.max(histogram, function (d) {return d.length; })])
            .range([plot.height, 0]);
        plot.yscale(y_scale);

        plot.cursorValues(x_scale, y_scale);

        // Bars
        plot.append("svg:g")
            .selectAll("rect")
            .data(histogram)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return x_scale(d.x);
            })
            .attr("y", function (d) {
                return y_scale(d.y);
            })
            .attr("width", function (d) {
                return x_scale(valueRange[0] + d.dx);
            })
            .attr("height", function (d) {
                return plot.height - y_scale(d.y);
            })
            .attr("fill", options.histogram.color);
    }
});
