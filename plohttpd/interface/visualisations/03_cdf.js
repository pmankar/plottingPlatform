/*global visualisation,d3,D3_xy,D3_legend,getLabels,StrokeOptionControl,generateArrayOptionControl,TextOptionControl,PositionOptionControl*/

visualisation.register({
    name: "CDF",
    ploshModule: "cdf",
    optionControls : function () {
        "use strict";

        return [
            {"label": "XY", "name": "xy", "controls": D3_xy.optionControls()},
            {"label": "Legend", "name": "legend", "controls": D3_legend.optionControls()},
            {"label": "CDF", "name": "cdf", "controls": [
                {"label": "Titel", "name": "titel", "control": new TextOptionControl("Titel")},
                {"label": "Lines", "name": "lines", "control": new (generateArrayOptionControl(StrokeOptionControl))([{"width": 2, "color": '#005AA9'}, {"width": 2, "color": '#F5A300'}, {"width": 2, "color": '#009D81'}, {"width": 2, "color": '#E6001A'}, {"width": 2, "color": '#A60084'}, {"width": 2, "color": 'green'}])},
                {"label": "Y-Label", "name": "ylabel", "control": new TextOptionControl("P[X <= x]")},
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
        labels.forEach(function (l, i) {
            var values = result.values[l.query].query.per_host;
            values.sort(d3.ascending);
            labels[i].values = values;
        });

        var names = labels.map(function (l) {return l.label; });

        var plot = new D3_xy(panel, options.xy);
        plot.xlabel(result.metrics.query.title);
        plot.ylabel(options.cdf.ylabel);
        plot.titel(options.cdf.titel);

        plot.add(new D3_legend(options.legend, names.map(function (_name, i) {return {"label": _name, "stroke": options.cdf.lines[i % options.cdf.lines.length]}; })));

        var valueRange;
        if (result.metrics.query.valueRange !== null) {
            valueRange = result.metrics.query.valueRange;
        } else {
            valueRange = [
                d3.min(labels, function (l) {return l.values[0]; }),
                d3.max(labels, function (l) {return l.values[l.values.length - 1]; })
            ];
        }

        var x_scale = d3.scale.linear()
            .domain(valueRange)
            .range([0, plot.width])
            .nice(5);
        plot.xscale(x_scale);

        var y_scale = d3.scale.linear()
            .domain([0, 1])
            .range([plot.height, 0]);
        plot.yscale(y_scale);

        plot.cursorValues(x_scale, y_scale);

        // Lines
        plot.append("g")
            .selectAll("path")
            .data(labels)
            .enter()
            .append("path")
            .attr("d", function (l, i) {
                var line = d3.svg.line()
                    .x(function (v, i) {return x_scale(v); })
                    .y(function (v, i) {return y_scale(i / (l.values.length - 1)); });
                return line(l.values);
            })
            .style("fill-opacity", 0)
            .style("stroke", function (l, i) {
                return options.cdf.lines[i % options.cdf.lines.length].color;
            })
            .style("stroke-width", function (l, i) {
                return options.cdf.lines[i % options.cdf.lines.length].width;
            });
    }
});
