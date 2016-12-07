/*global visualisation,d3,D3_xy,D3_legend,getLabels,ColorOptionControl,generateArrayOptionControl,StrokeOptionControl,PercentOptionControl,PositionOptionControl,TextOptionControl*/

visualisation.register({
    name: "BarPlot",
    ploshModule: "barPlot",
    optionControls : function () {
        "use strict";

        return [
            {"label": "XY", "name": "xy", "controls": D3_xy.optionControls()},
            {"label": "Legend", "name": "legend", "controls": D3_legend.optionControls()},
            {"label": "BarPlot", "name": "barPlot", "controls": [
                {"label": "Titel", "name": "titel", "control": new TextOptionControl("Titel")},
                {"label": "Colors", "name": "colors", "control": new (generateArrayOptionControl(ColorOptionControl))(['#005AA9', '#F5A300', '#009D81', '#E6001A', '#A60084', 'green'])},
                {"label": "Error bars", "name": "errorbar", "control": new StrokeOptionControl({"width": 3, "color": "black"})},
                {"label": "Bar border", "name": "border", "control": new StrokeOptionControl({"width": 2, "color": "black"})},
                {"label": "Outer bar margin", "name": "innermargin", "control": new PercentOptionControl(0.3)},
                {"label": "Inner bar margin", "name": "outermargin", "control": new PercentOptionControl(0.3)},
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
        plot.xlabel(axis);
        plot.ylabel(result.metrics.query.title);
        plot.titel(options.barPlot.titel);
        plot.add(new D3_legend(options.legend, names.map(function (_name, i) {return {"label": _name, "color": options.barPlot.colors[i % options.barPlot.colors.length]}; })));

        var x_scale = d3.scale.ordinal()
            .domain(names)
            .rangeBands([0, plot.width], options.barPlot.outermargin, options.barPlot.innermargin);
        plot.xscale(x_scale);

        var valueRange;
        if (result.metrics.query.valueRange !== null) {
            valueRange = result.metrics.query.valueRange;
        } else {
            valueRange = [0, d3.max(labels, function (l) {return result.values[l.query].query.aggregated.avg + result.values[l.query].query.aggregated.err; })];
        }

        var y_scale = d3.scale.linear()
            .domain(valueRange)
            .range([plot.height, 0])
            .nice(5);
        plot.yscale(y_scale);

        plot.cursorValues(x_scale, y_scale);

        var bar_width = x_scale.rangeBand();

        labels.forEach(function (l, i) {
            // Bars
            plot.append("rect")
                .attr("x", x_scale(l.label))
                .attr("y", y_scale(result.values[l.query].query.aggregated.avg))
                .attr("width", bar_width)
                .attr("height", plot.height - y_scale(result.values[l.query].query.aggregated.avg))
                .attr("fill", options.barPlot.colors[i % options.barPlot.colors.length])
                .attr("stroke", options.barPlot.border.color)
                .attr("stroke-width", options.barPlot.border.width);

            // Error bar
            var x = x_scale(l.label) + bar_width / 2;
            var y1 = y_scale(result.values[l.query].query.aggregated.avg + result.values[l.query].query.aggregated.err);
            var y2 = y_scale(result.values[l.query].query.aggregated.avg - result.values[l.query].query.aggregated.err);
            plot.append("polygon")
                .attr("points", [
                    (x - options.barPlot.errorbar.width / 2) + "," + y1,
                    (x - 3) + "," + y1,
                    (x + 3) + "," + y1,
                    (x + options.barPlot.errorbar.width / 2) + "," + y1,
                    (x + options.barPlot.errorbar.width / 2) + "," + y2,
                    (x + 3) + "," + y2,
                    (x - 3) + "," + y2,
                    (x - options.barPlot.errorbar.width / 2) + "," + y2,
                ].join(","))
                .style("stroke", options.barPlot.errorbar.color)
                .style("fill", options.barPlot.errorbar.color);
        });
    }
});
