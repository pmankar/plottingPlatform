/*global $,d3,PaddingOptionControl,SizeOptionControl,FontOptionControl,MarkerOptionControl*/

function D3_xy(panel, options) {
    "use strict";

    this.width = options.size.width;
    this.height = options.size.height;
    this.padding_top = options.padding.top;
    this.padding_right = options.padding.right;
    this.padding_bottom = options.padding.bottom;
    this.padding_left = options.padding.left;

    this._zoom = function () {
        this.svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    };

    this.svg = d3.select(panel.get(0)).append("svg")
        .attr("width", this.width + this.padding_left + this.padding_right)
        .attr("height", this.height + this.padding_top + this.padding_bottom)
        .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", this._zoom.bind(this)));

    this.svg.append("defs").append("svg:clipPath")
        .attr("id", "paintArea")
        .append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.width)
        .attr("height", this.height);

    // Background
    this.svg.append("rect")
        .attr("x", 0).attr("y", 0).attr("width", this.svg.attr("width")).attr("height", this.svg.attr("height")).style("fill", "white");

    this.paintArea = this.svg.append("g")
        .attr("transform", "translate(" + this.padding_left + "," + this.padding_top + ")")
        .attr("clip-path", "url(#paintArea)");

    this.axisArea = this.svg.append("g");

    // Border
    this.svg.append("rect")
        .attr("transform", "translate(" + this.padding_left + "," + this.padding_top + ")")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill-opacity", 0);

    this.xscale = function (scale, valueGenerator) {
        var axis = d3.svg.axis().scale(scale).orient("bottom").ticks(4);
        if (valueGenerator !== undefined) {
            axis.tickValues(scale.domain().map(valueGenerator));
        }

        this.axisArea.append("g")
            .attr("transform", "translate(" + this.padding_left + "," + (this.padding_top + this.height) + ")")
            .call(axis.tickSize(0))
            .selectAll("text")
            .attr("text-anchor", "middle")
            .attr("dy", 0.71 * options.axisFont.size) // Bugfix to import SVGs to Inkscape. Factor is adjusted to orient("bottom") and our version of d3js!
            .style("font-family", '"' + options.axisFont.family + '"')
            .style("font-size", options.axisFont.size + "px");
        this.axisArea.append("g")
            .attr("transform", "translate(" + this.padding_left + "," + (this.padding_top + this.height) + ")")
            .call(axis.tickSize(-this.height, 0, 0).tickFormat(""))
            .selectAll(".tick")
            .style("stroke", "gray")
            .style("stroke-dasharray", "2,2");
    };


    this.yscale = function (scale, valueGenerator) {
        var axis = d3.svg.axis().scale(scale).orient("left").ticks(5);
        if (valueGenerator !== undefined) {
            axis.tickValues(scale.domain().map(valueGenerator));
        }

        this.axisArea.append("g")
            .attr("transform", "translate(" + this.padding_left + "," + this.padding_top + ")")
            .call(axis.tickSize(0))
            .selectAll("text")
            .attr("dy", 0.32 * options.axisFont.size) // Bugfix to import SVGs to Inkscape. Factor is adjusted to orient("left") and our version of d3js!
            .style("font-family", '"' + options.axisFont.family + '"')
            .style("font-size", options.axisFont.size + "px");
        this.axisArea.append("g")
            .attr("transform", "translate(" + this.padding_left + "," + this.padding_top + ")")
            .call(axis.tickSize(-this.width, 0, 0).tickFormat(""))
            .selectAll(".tick")
            .style("stroke", "gray")
            .style("stroke-dasharray", "2,2");
    };

    this.xlabel = function (label) {
        return this.axisArea.append("text")
            .attr("x", this.padding_left + this.width / 2)
            .attr("y", this.padding_top + this.height + this.padding_bottom - options.labelFont.size / 4)
            .text(label)
            .attr("text-anchor", "middle")
            .style("font-family", '"' + options.labelFont.family + '"')
            .style("font-size", options.labelFont.size + "px");
    };

    this.titel = function (label) {
        return this.axisArea.append("text")
            .attr("x", this.padding_left + this.width / 2)
            .attr("y", this.padding_top - 60 + this.padding_bottom - options.labelFont.size / 4)
            .text(label)
            .attr("text-anchor", "middle")
            .style("font-family", '"' + options.labelFont.family + '"')
            .style("font-size", options.labelFont.size + 2 + "px");
    };

    this.ylabel = function (label) {
        return this.axisArea.append("text")
            .text(label)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90) translate(" + (-this.padding_top - this.height / 2) + "," + options.labelFont.size + ")")
            .style("font-family", '"' + options.labelFont.family + '"')
            .style("font-size", options.labelFont.size + "px");
    };

    this.add = function (paint) {
        paint(this, this.svg.append.bind(this.svg));
    };

    this.append = function (type) {
        return this.paintArea.append(type);
    };

    var temp = this.svg.append("text");

    this.cursorValues = function (xScale, yScale) {
        this.svg.on("mousemove", function (d, i) {
            var xMouse = d3.mouse(this)[0];
            var yMouse = d3.mouse(this)[1];
            var xPos = xMouse - options.padding.left;
            var yPos = yMouse - options.padding.top;

            if (xPos >= 0 && xPos <= options.size.width && yPos >= 0 && yPos <= options.size.height) {
                var xValue;
                var yValue;

                if (xScale.ticks) {
                    //numeric
                    xValue = (xScale.domain()[1] - ((xScale.domain()[1] - xScale.domain()[0]) * ((options.size.width - xPos) / options.size.width))).toFixed(2);
                } else {
                    //ordinal
                    var leftEdgesX = xScale.range();
                    var widthX = xScale.rangeBand();
                    var xj = 0;
                    while (xPos > leftEdgesX[xj] + widthX) {
                        xj = xj + 1;
                    }
                    xValue = xScale.domain()[xj];
                }

                if (yScale.ticks) {
                    //numeric
                    yValue = (yScale.domain()[0] + ((yScale.domain()[1] - yScale.domain()[0]) * ((options.size.height - yPos) / options.size.height))).toFixed(2);
                } else {
                    //ordinal
                    var leftEdgesY = yScale.range();
                    var yj = 0;
                    while (yPos < leftEdgesY[yj]) {
                        yj = yj + 1;
                    }
                    yValue = yScale.domain()[yj];
                }

                temp.text("(" + xValue + "/" + yValue + ")")
                    .attr("x", xMouse)
                    .attr("y", yMouse)
                    .attr("dx", 5)
                    .style("fill", "red");
            } else {
                temp.text("");
            }
        });
    };
}

D3_xy.optionControls = function () {
    "use strict";

    return [
        {"label": "Size", "name": "size", "control": new SizeOptionControl({"width": 500, "height": 300})},
        {"label": "Padding top/right/bottom/left", "name": "padding", "control": new PaddingOptionControl({"top": 50, "right": 100, "bottom": 45, "left": 65})},
        {"label": "Label font", "name": "labelFont", "control": new FontOptionControl({"family": "sans-serif", "size": 18})},
        {"label": "Axis font", "name": "axisFont", "control": new FontOptionControl({"family": "sans-serif", "size": 18})},
    ];
};
