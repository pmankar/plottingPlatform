/*jslint browser: true*/
/*global $*/

function generateArrayOptionControl(Control) {
    "use strict";

    return function (_defaults) {
        var _array_control = this;

        this._element = $("<div>");

        this._refresh = function () {
            var _button_add = $("<button>")
                .attr("type", "button")
                .addClass("pull-right btn btn-success")
                .css("width", "10%")
                .click(function () {
                    _array_control._addControl();
                })
                .append($("<span>").addClass("glyphicon glyphicon-plus"));
            this._element
                .empty()
                .append(this._controls.map(this._createControlRow))
                .append(_button_add);
        };
        this._createControl = function (_value) {
            return new Control(_value);
        };
        this._createControlRow = function (_control) {
            var _button_remove = $("<button>")
                .attr("type", "button")
                .addClass("pull-right btn btn-danger")
                .css("width", "10%")
                .click(function () {
                    var i = _array_control._element.children().index($(this).parent());
                    _array_control._removeControl(i);
                })
                .append($("<span>").addClass("glyphicon glyphicon-minus"));
            return $("<div>").css("margin-bottom", "0.2em").append([_button_remove, $("<div>").css("width", "85%").append(_control.getFormElement())]);
        };
        this._removeControl = function (i) {
            this._controls.splice(i, 1);
            this._element.children().get(i).remove();
        };
        this._addControl = function () {
            var _control = this._createControl();
            this._element.children().last().before(this._createControlRow(_control));
            this._controls.push(_control);
        };

        this.getFormElement = function () {
            return this._element;
        };
        this.getValue = function () {
            return this._controls.map(function (_control) {return _control.getValue(); });
        };
        this.set = function (_values) {
            this._controls = _values.map(this._createControl);
            this._refresh();
        };
        this.reset = function () {
            this.set(_defaults);
        };

        this.reset();
    };
}
