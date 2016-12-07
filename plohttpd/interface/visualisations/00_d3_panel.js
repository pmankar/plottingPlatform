/*global $,d3*/

function D3_panel(panel, width, height) {
    "use strict";

    this.width = width;
    this.height = height;

    this._zoom = function () {
        this.svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    };

    this.svg = d3.select(panel.get(0)).append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", this._zoom.bind(this)));

    // Background
    this.svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.svg.attr("width")).attr("height", this.svg.attr("height"))
        .style("fill", "white");

    this.add = function (paint) {
        paint(this, this.svg.append.bind(this.svg));
    };

    this.append = function (type) {
        return this.svg.append(type);
    };
}
