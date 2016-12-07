/*global $*/

function generateConditionalOptionControl(_width1, _width2, _options) {
    "use strict";

    return function (_default) {
        this._updateSlave = function () {
            this._slave = new (this._getSelectedMaster().slave)("");
            this._slave_panel.empty().append(this._slave.getFormElement());
        };

        this._master = $("<select>").addClass("form-control")
            .append(_options.map(function (_option, _i) {return $("<option>").val(_i).text(_option.label); }))
            .change(this._updateSlave.bind(this));

        this._slave = null;
        this._slave_panel = $("<div>");

        this._panel = $("<div>")
            .append($("<div>").css("float", "left").css("width", _width1).append(this._master))
            .append($("<div>").css("float", "left").css("width", _width2).append(this._slave_panel))
            .append($("<div>").css("clear", "left"));

        this.getFormElement = function () {
            return this._panel;
        };
        this._getSelectedMaster = function () {
            return _options[this._master.val()];
        };
        this.getValue = function () {
            return {"master": this._getSelectedMaster().value, "slave": this._slave.getValue()};
        };
        this.set = function (_value) {
            this._master.val(_options.map(function (_option) {return _option.value; }).indexOf(_value.master));
            this._updateSlave();
            this._slave.set(_value.slave);
        };
        this.reset = function () {
            this.set(_default);
        };

        this.reset();
    };
}
