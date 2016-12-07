/*global $*/

function generateTextOptionControl(_appendix, _transforms) {
    "use strict";

    if (_transforms === undefined) {
        _transforms = {
            "value2display": function (_value) {return _value; },
            "display2value": function (_display) {return _display; },
        };
    }

    return function (_default) {
        this._element = $("<input>").addClass("form-control");
        this._control = this._element;
        if (_appendix !== undefined && _appendix !== "") {
            this._control = $("<div>").addClass("input-group")
                .append(this._control)
                .append($("<div>").addClass("input-group-addon").text(_appendix));
        }

        this.getFormElement = function () {
            return this._control;
        };
        this.getValue = function () {
            return _transforms.display2value(this._element.val());
        };
        this.set = function (_value) {
            this._element.val(_transforms.value2display(_value));
        };
        this.reset = function () {
            this.set(_default);
        };

        this.reset();
    };
}

var TextOptionControl = generateTextOptionControl();
