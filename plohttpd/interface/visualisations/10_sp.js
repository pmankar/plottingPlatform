/*global visualisation,d3,D3_xy,ColorOptionControl,NumberOptionControl,TextOptionControl*/

visualisation.register({
    name: "Scattered",
    optionControls : function () {
        "use strict";

        return [
            {"label": "XY", "name": "xy", "controls": D3_xy.optionControls()},
            {"label": "Scattered", "name": "scattered", "controls": [
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
		console.log(result);
        var data = result.values[result.query].query.per_host;
        var scattered = d3.layout.histogram().bins(options.scattered.bins)(data);
		
        var plot = new D3_xy(panel, options.xy);
        plot.titel(options.scattered.titel);
        plot.xlabel(result.metrics.query.title);

        var valueRange;
        if (result.metrics.query.valueRange !== null) {
            valueRange = result.metrics.query.valueRange;
        } else {
            valueRange = d3.extent(data);
        }

        var x_scale = d3.scale.linear()
            .domain([0, data.length])
            .range([0, plot.width]);
        plot.xscale(x_scale);

        var y_scale = d3.scale.linear()
            .domain(valueRange)
            .range([plot.height, 0]);
        plot.yscale(y_scale);

        plot.cursorValues(x_scale, y_scale);
		
        // plots
        plot.append("svg:g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d,i){
				return x_scale(i);
			})
            .attr("cy", function (d){
				return y_scale(d==null?0:d);
			})
			.attr("r", 4)
			.attr("fill", options.scattered.color);
    }
});
