/*global MarkerOptionControl,FontOptionControl,TextOptionControl,DistanceOptionControl,LegendPositionOptionControl,PaddingOptionControl,StrokeOptionControl,OpacityColorOptionControl*/

function D3_legend(options, items) {
    "use strict";

    return function (panel, append) {
        var _position = LegendPositionOptionControl.lookupPosition(options.position, panel);
        var _maxItemSize = items.reduce(function (_size, _item) {return _item.marker !== undefined ? Math.max(_item.marker.size, _size) : _size; }, -1);

        if (_position === null) {
            return;
        }

        var _height = options.legendFont.size + items.length * options.legendSize + options.legendHeadSpace + options.padding.top + options.padding.bottom;
        var _width = options.width + options.padding.left + options.padding.right;
        var _x = _position.x + _width * _position.dx;
        var _y = _position.y + _height * _position.dy;

        append("rect")
            .attr("x", _x)
            .attr("y", _y)
            .attr("width", _width)
            .attr("height", _height)
            .style("stroke-width", options.border.width)
            .style("stroke", options.border.color)
            .style("fill", options.background.color)
            .style("fill-opacity", options.background.opacity);

        items.forEach(function (_item, i) {
            var _pos_x = _x + options.padding.left;
            var _pos_y = _y + options.padding.top + options.legendFont.size + i * options.legendSize + options.legendHeadSpace;
            if (_item.marker !== undefined) {
                var _marker = _item.marker;
                var _polygon = MarkerOptionControl.lookupMarkerCode(_marker.marker);
                var _cx = _pos_x + options.legendSize / 2;
                var _cy = _pos_y + options.legendSize / 2;
                var _factor = options.legendSize * _marker.size / _maxItemSize / 2;
                append(_polygon.svgElement)
                    .attr("cx", _cx)
                    .attr("cy", _cy)
                    .attr("r", options.legendSize / 2)
                    .attr("points", _polygon.edges === undefined ? "" : _polygon.edges.map(function (p) {return (_cx + p[0] * _factor) + "," + (_cy + p[1] * _factor); }).join(" "))
                    .style("fill", _marker.color)
                    .style("stroke", "black")
                    .style("stroke-width", 1);
            }
            if (_item.color !== undefined) {
                append("rect")
                    .attr("x", _pos_x)
                    .attr("y", _pos_y)
                    .attr("height", options.legendSize)
                    .attr("width", options.legendSize)
                    .attr("stroke", "black")
                    .attr("fill", _item.color);
            }
            if (_item.stroke !== undefined) {
                append("line")
                    .attr("x1", _pos_x)
                    .attr("y1", _pos_y + options.legendSize / 2)
                    .attr("x2", _pos_x + options.legendSize)
                    .attr("y2", _pos_y + options.legendSize / 2)
                    .attr("stroke", _item.stroke.color)
                    .attr("stroke-width", _item.stroke.width);
            }
            append("text")
                .style("font-family", '"' + options.legendFont.family + '"')
                .style("font-size", options.legendFont.size + "px")
                .attr("x", _pos_x + options.legendSize + options.legendIconSpace)
                .attr("y", _pos_y + (options.legendSize + options.legendFont.size) / 2)
                .text(isNaN(_item.label) ? _item.label : Math.round(_item.label));
        }.bind(this));
        append("text")
            .attr("x", _x + options.padding.left)
            .attr("y", _y + options.padding.top + options.legendFont.size)
            .style("font-family", options.legendFont.family)
            .style("font-size", options.legendFont.size + "px")
            .text(options.title);
    };
}

D3_legend.optionControls = function () {
    "use strict";

    return [
        {"label": "Position", "name": "position", "control": new LegendPositionOptionControl({"master": "none", "slave": ""})},
        {"label": "Width", "name": "width", "control": new DistanceOptionControl(60)},
        {"label": "Padding top/right/bottom/left", "name": "padding", "control": new PaddingOptionControl({"top": 5, "right": 5, "bottom": 5, "left": 5})},
        {"label": "Border", "name": "border", "control": new StrokeOptionControl({"width": 0, "color": "black"})},
        {"label": "Background", "name": "background", "control": new OpacityColorOptionControl({"color": "white", "opacity": 1})},
        {"label": "Heading space", "name": "legendHeadSpace", "control": new DistanceOptionControl(10)},
        {"label": "Icon space", "name": "legendIconSpace", "control": new DistanceOptionControl(5)},
        {"label": "Font", "name": "legendFont", "control": new FontOptionControl({"family": "sans-serif", "size": 16})},
        {"label": "Title", "name": "title", "control": new TextOptionControl("Legend")},
        {"label": "Size", "name": "legendSize", "control": new DistanceOptionControl(20)},
    ];
};
