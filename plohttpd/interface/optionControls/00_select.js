/*global $*/

function generateSelectOptionControl(_options) {
    "use strict";

    return function (_default) {
        this._element = $("<select>").addClass("form-control")
            .append(_options.map(function (_option) {return $("<option>").val(_option.value).text(_option.label); }));

        this.getFormElement = function () {
            return this._element;
        };
        this.getValue = function () {
            return this._element.val();
        };
        this.set = function (_value) {
            this._element.val(_value);
        };
        this.reset = function () {
            this.set(_default);
        };

        this.reset();
    };
}
