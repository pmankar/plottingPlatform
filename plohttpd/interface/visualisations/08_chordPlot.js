/*global visualisation,d3,D3_panel,D3_legend,SizeOptionControl,PaddingOptionControl,ColorOptionControl,OpacityColorOptionControl,FontOptionControl,generateArrayOptionControl,CheckboxOptionControl,TextOptionControl,NumberOptionControl,DistanceOptionControl*/

visualisation.register({
    name: "ChordPlot",
    optionControls : function () {
        "use strict";

        return [
            {"label": "Panel", "name": "panel", "controls": [
                {"label": "Size", "name": "size", "control": new SizeOptionControl({"width": 300, "height": 300})},
                {"label": "Padding", "name": "padding", "control": new PaddingOptionControl({"top": 100, "right": 100, "bottom": 100, "left": 100})},
            ]},
            {"label": "Legend", "name": "legend", "controls": D3_legend.optionControls()},
            {"label": "Chord", "name": "chord", "controls": [
                {"label": "Label font", "name": "labelFont", "control": new FontOptionControl({"family": "sans-serif", "size": 18})},
                {"label": "Colors & Chord opacities", "name": "colors", "control": new (generateArrayOptionControl(OpacityColorOptionControl))([{"color": '#005AA9', "opacity": 1}, {"color": '#F5A300', "opacity": 1}, {"color": '#009D81', "opacity": 1}, {"color": '#E6001A', "opacity": 1}, {"color": '#A60084', "opacity": 1}, {"color": 'green', "opacity": 1}])},
                {"label": "Annotation font", "name": "annotationFont", "control": new FontOptionControl({"family": "sans-serif", "size": 18})},
                {"label": "Modolu annotation Label", "name": "modoluLabel", "control": new NumberOptionControl(2)},
                {"label": "Modolu annotation Line", "name": "modoluLine", "control": new NumberOptionControl(5)},
                {"label": "Annotation appand", "name": "labelAppand", "control": new TextOptionControl("%")},
                {"label": "Wheel width", "name": "wheelWidth", "control": new DistanceOptionControl(30)},
                {"label": "Stroke", "name": "stroke", "control": new ColorOptionControl("black")},
                {"label": "Padding between chords", "name": "paddingChords", "control": new DistanceOptionControl(6)},
                {"label": "Show names", "name": "showNames", "control": new CheckboxOptionControl(true)},
                {"label": "Titel", "width": "25%", "control": new TextOptionControl("titel")},
            ]}
        ];
    },
    guard : function (result) {
        "use strict";

        // Verify we only have one result and chord-data is available
        return typeof result.query === "string" && result.values[result.query].query.chord !== undefined && result.values[result.query].query.chord.length > 0 && result.metrics.query !== undefined;
    },
    create: function (panel, result, options) {
        "use strict";

        var names = [];
        var matrix = [];
        var x, y;
        var sum = result.values[result.query].query.chord.reduce(function (_sum, row) {return _sum + row.value; }, 0);
        result.values[result.query].query.chord.forEach(function (row) {
            if (names.indexOf(row.source) === -1) {
                names.push(row.source);
            }
            if (names.indexOf(row.target) === -1) {
                names.push(row.target);
            }
            x = names.indexOf(row.source);
            y = names.indexOf(row.target);
            if (matrix[y] === undefined) {
                matrix[y] = [];
            }
            // Bug: row.value happens to be too large.
            matrix[y][x] = row.value / sum * 100;
        });

        var plot = new D3_panel(panel, options.panel.padding.left + options.panel.size.width + options.panel.padding.right, options.panel.padding.top + options.panel.size.height + options.panel.padding.bottom);

        // compute size of the wheel
        var outerRadius = Math.min(options.panel.size.width, options.panel.size.height) / 2;
        var innerRadius = outerRadius - options.chord.wheelWidth;

        //chords
        var chord = d3.layout.chord()
            .matrix(matrix)
            .padding(options.chord.paddingChords / 100);

        //Scale for colors
        var scaleFill = d3.scale.ordinal()
            .domain(names)
            .range(options.chord.colors);

        var graph = plot.append("g")
            .attr("transform", "translate(" + (options.panel.padding.left + (options.panel.size.width / 2)) + "," + (options.panel.padding.top + (options.panel.size.height / 2)) + ")");

        //build wheel
        var arc1 = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var g1 = graph.selectAll("g.group")
            .data(chord.groups)
            .enter()
            .append("g")
            .attr("class", "group");

        g1.append("path")
            .attr("d", arc1)
            .style("stroke", options.chord.stroke)
            .style("fill", function (d) {
                return scaleFill(names[d.index]).color;
            })
            .attr("id", function (d) {
                return "group-" + d.index;
            });

        if (options.chord.showNames) {
            g1.append("text")
                .attr("dx", 6)
                .attr("class", "country")
                .attr("dy", options.chord.wheelWidth - 5)
                .append("svg:textPath")
                .attr("xlink:href", function (d) {
                    return "#group-" + d.index;
                })
                .attr("font-family", options.chord.labelFont.family)
                .attr("font-size", options.chord.labelFont.size + "px")
                .text(function (d) {
                    return names[d.index];
                });
        }

        //Inner Chords
        graph.selectAll("path.chord")
            .data(chord.chords)
            .enter()
            .append("path")
            .attr("class", "chord")
            .style("stroke", options.chord.stroke)
            .style("fill", function (d) {
                return scaleFill(names[d.source.index]).color;
            })
            .attr("d", d3.svg.chord().radius(innerRadius))
            .style("opacity",  function (d) {
                return scaleFill(names[d.source.index]).opacity;
            });

        //ticks
        function groupTicks(d) {
            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value + 1, options.chord.modoluLine).map(function (v, i) {
                return {angle: v * k + d.startAngle, label: i % options.chord.modoluLabel !== 0 ? null : v + options.chord.labelAppand};
            });
        }
        var ticks = g1.selectAll("g")
            .data(groupTicks)
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + outerRadius + ",0)";
            });

        ticks.append("line")
            .attr("x1", 1)
            .attr("y1", 0)
            .attr("x2", 5)
            .attr("y2", 0)
            .style("stroke", options.chord.stroke);

        ticks.append("text")
            .attr("x", 8)
            .attr("dy", ".35em")
            .attr("transform", function (d) {
                return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
            })
            .style("text-anchor", function (d) {
                return d.angle > Math.PI ? "end" : null;
            })
            .text(function (d) {
                return d.label;
            })
            .attr("font-family", options.chord.annotationFont.family)
            .attr("font-size", options.chord.annotationFont.size);

        plot.add(new D3_legend(options.legend, names.map(function (_name) {return {"label": _name, "color": scaleFill(_name).color}; })));
    }
});
