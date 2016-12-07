/*global $*/

function StaticOptionControl(_default) {
    "use strict";

    this._element = $("<div>");

    this.getFormElement = function () {
        return this._element;
    };
    this.getValue = function () {
        return _default;
    };
    this.set = function (_value) {
        // Do nothing (_STATIC_)
        this._element.data("value", _value);
    };
    this.reset = function () {
        this.set(_default);
    };

    this.reset();
}

