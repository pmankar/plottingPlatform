/*global $*/

function NoneAxis(_parameter, _axis) {
    "use strict";

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
