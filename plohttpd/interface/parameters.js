/*global $,sidebar,visualisation,help,axes,application*/

var parameters;

function Parameter(_parameter) {
    "use strict";

    var parameter = this;

    this._panel = sidebar.add(_parameter.name);
    this._panel.onClick(function () {parameter.togglePane(); });
    this._panel.getContentPane().hide().append(
        $("<div>")
            .addClass("row")
            .append($("<label>").attr("for", "parameter-" + _parameter.name).addClass("col-sm-5").text("Usage"))
            .append(
                $("<div>").addClass("col-sm-7").append(
                    $("<select>").addClass("form-control").addClass("axis")
                        .change(function () {
                            parameters.toggleAxis(parameter._current_axis, true);
                            parameter.setAxis($(this).val());
                            parameters.toggleAxis(parameter._current_axis, false);
                        })
                        .append(axes.map(function (_axis, i) {return $("<option>").val(i).text(_axis.label); }))
                )
            )
    );
    this._options_panel = $("<div>");
    this._panel.getContentPane().append(this._options_panel);
    this._axis = null;
    this._current_axis = null;
    this.values = _parameter.values;

    this.togglePane = function (show) {
        if (show === undefined) {
            show = !this._panel.getContentPane().is(":visible");
        }
        // jQuery.toggle() does not allow animations (and slideToggle does not accept a parameter)
        if (show) {
            this._panel.getContentPane().slideDown();
        } else {
            this._panel.getContentPane().slideUp();
        }
        this._panel.setTitle(_parameter.name + (show ? "" : " (" + this._axis.getReadableValue() + ")"));
    };
    this.remove = function () {
        this._panel.remove();
    };
    this.setAxis = function (_axis) {
        this._panel.getContentPane().find("select.axis").val(_axis);
        this._current_axis = _axis;
        this._axis = new axes[_axis].handler(this, axes[_axis]);
        this._options_panel.empty().append(this._axis.getPanel());
    };
    this.getValue = function () {
        return {"label": axes[this._current_axis].label, "type": axes[this._current_axis].type, "value": this._axis.getValue()};
    };
    this.setValue = function (value) {
        var _axis = axes.reduce(function (_cur_i, _axis, _i) {if (_axis.label === value.label) {return _i; } return _cur_i; }, null);
        // TODO problem iff (_axis === undefined)
        this.setAxis(_axis);
        this._axis.setValue(value.value);
        // Refresh paneltitle
        this.togglePane(false);
    };

    this.setAxis(0);
    this.togglePane(false);
}

parameters = {
    _parameters : [],

    toggleAxis : function (current_axis, enabled) {
        "use strict";

        if (axes[current_axis].limit === false) {
            return;
        }

        this._parameters.forEach(function (_parameter, i) {
            _parameter.handler._panel.getContentPane().find("select.axis").find("option[value='" + current_axis + "']").prop("disabled", function () {return !enabled && !$(this).is(":selected"); });
        });
    },
    hide : function () {
        "use strict";

        this._parameters.forEach(function (_parameter) {
            _parameter.handler.remove();
        });
        this._parameters = [];
    },
    show : function (_parameters) {
        "use strict";

        this.hide();
        parameters._parameters = _parameters.map(function (parameter) {return {"name": parameter.name, "handler": new Parameter(parameter)}; });
    },
    getValues : function () {
        "use strict";

        return this._parameters.map(function (parameter) {return {"name": parameter.name, "value": parameter.handler.getValue()}; });
    },
    setValues : function (_values) {
        "use strict";

        this._parameters.forEach(function (_parameter) {
            var value = _values.filter(function (_value) {return _value.name === _parameter.name; })[0];
            if (value !== undefined) {
                _parameter.handler.setValue(value.value);
            }
        });
    },
};
