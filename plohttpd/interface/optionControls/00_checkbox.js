/*global $*/

function CheckboxOptionControl(_default) {
    "use strict";

    this._element = $("<input>").attr("type", "checkbox");

    this.getFormElement = function () {
        return $("<div>").addClass("checkbox").append(this._element);
    };
    this.getValue = function () {
        return this._element.prop("checked");
    };
    this.set = function (_value) {
        this._element.prop("checked", _value);
    };
    this.reset = function () {
        this.set(_default);
    };

    this.reset();
}
