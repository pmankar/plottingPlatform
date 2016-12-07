/*global $*/

function generateCombinedOptionControl(_controls) {
    "use strict";

    return function (_default) {
        this.controls = _controls.map(function (_control) {return {"name": _control.name, "width": _control.width, "control": new _control.control(_default[_control.name])}; });

        this.getFormElement = function () {
            return $("<div>")
                .append(this.controls.map(function (_control) {
                    return $("<div>").css("float", "left").css("width", _control.width).append(_control.control.getFormElement());
                }))
                .append($("<div>").css("clear", "left"));
        };
        this.getValue = function () {
            var _value = {};
            this.controls.forEach(function (_control) {
                _value[_control.name] = _control.control.getValue();
            });
            return _value;
        };
        this.set = function (_value) {
            if (typeof _value !== "object") {
                // TODO what to do now?
                return;
            }
            Object.keys(_value).forEach(function (_name) {
                this.controls.filter(function (_control) {return _control.name === _name; })[0].control.set(_value[_name]);
            }.bind(this));
        };
        this.reset = function () {
            this.set(_default);
        };

        this.reset();
    };
}
