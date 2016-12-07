/*global $*/

function StaticAxis(_parameter, _axis) {
    "use strict";

    this._panel = $("<div>").addClass("row")
        .append($("<div>").addClass("col-sm-5")
            .append($("<label>").attr("for", "parameter-" + _parameter.name).text("Value"))
            )
        .append($("<div>").addClass("col-sm-7")
            .append($("<select>")
                .addClass("form-control")
                .addClass("parameter")
                .append(_parameter.values.map(function (_value) {return $("<option>").text(_value); }))
                .attr("id", "parameter-" + _parameter.name)
                )
            );

    this.getPanel = function () {
        return this._panel;
    };
    this.getValue = function () {
        return this._panel.find(".parameter").val();
    };
    this.setValue = function (value) {
        this._panel.find(".parameter").val(value);
    };
    this.getReadableValue = function () {
        return this._panel.find(".parameter").val();
    };
}
