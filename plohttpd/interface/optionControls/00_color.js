/*jslint browser: true*/
/*global $,tinycolor*/

function ColorOptionControl(_default) {
    "use strict";

    this._element = $("<input>").addClass("form-control");

    this.getFormElement = function () {
        // This is a really dirty hack. Do not even think about copying it.
        window.setTimeout(function () {this._element.pickAColor(); }.bind(this), 50);
        return this._element;
    };
    this.getValue = function () {
        return tinycolor(this._element.val()).toHexString();
    };
    this.set = function (_value) {
        this._element.val(_value);
    };
    this.reset = function () {
        this.set(_default);
    };

    this.reset();
}
