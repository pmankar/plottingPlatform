/*global visualisation,d3,D3_xy,generateArrayOptionControl,FontOptionControl,ColorOptionControl,TextOptionControl*/

visualisation.register({
    name: "Demo",
    optionControls : function () {
        "use strict";

        // use this to define your Optionpanel. Examples can be found in other visualisations.
        /// Do not forget to specify all used OptionControls in the headline
        return [
            {"label": "XY", "name": "xy", "controls": D3_xy.optionControls()},
            {"label": "Demo", "name": "demo", "controls": [
                {"label": "Fonts", "name": "fonts", "control": new (generateArrayOptionControl(FontOptionControl))([{"family": "sans-serif", "size": 18}, {"family": "monospace", "size": 12}])},
                {"label": "Titel", "name": "titel", "control": new TextOptionControl("Titel")},
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

        // we verified in our guard that result.query will only contain one experiment-string (which are the keys of result.values)
        // if multiple data-sources are available, result.query will become a more complex structure
        // access data of data-field "example_data" in poller "example"
        var data = result.values[result.query].query.example.example_data;

        // plot the panel
        var plot = new D3_xy(panel, options.xy);

        // Render the given string obtained from the option-panel defined above
        plot.titel(options.demo.titel);

        // here you can plot the name of the xlabal
        plot.xlabel(result.metrics.query.title);

        // you can choose the x_scale
        var x_scale = d3.scale.linear()
            .domain([0, data[0].length])
            .range([0, plot.width]);
        plot.xscale(x_scale);

        // and the y_scale
        var y_scale = d3.scale.linear()
            .domain([0, data.length])
            .range([plot.height, 0]);
        plot.yscale(y_scale);

        // Plot everything as string
        data.forEach(function (row, i) {
            console.log([i, row]);
            plot.append("g")
                .selectAll("text")
                .data(row)
                .enter()
                .append("text")
                .text(function (value) {return value; })
                .attr("x", function (value, j) {return x_scale(j); })
                .attr("y", function (value, j) {return y_scale(i); })
                .style("font-family", '"' + options.demo.fonts[i % options.demo.fonts.length].family + '"')
                .style("font-size", options.demo.fonts[i % options.demo.fonts.length].size + "px");
        });

        plot.cursorValues(x_scale, y_scale);
    }
});
