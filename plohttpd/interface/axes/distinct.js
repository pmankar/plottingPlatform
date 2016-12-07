/*global $*/

function DistinctAxis(_parameter, _axis) {
    "use strict";

    var axis = this;
    this._list_panel = $("<div>");
    this._panel = $("<div>")
        .append(this._list_panel)
        .append($("<div>").addClass("row")
            .append($("<div>").addClass("col-sm-9"))
            .append($("<div>").addClass("col-sm-3")
                .append($("<button>")
                    .addClass("btn btn-success")
                    .append($("<span>").addClass("glyphicon glyphicon-plus"))
                    .click(function () {
                        axis._appendRow();
                    })
                    )
                )
            );

    this._clear = function () {
        this._list_panel.empty();
    };
    this._appendRow = function (label, value) {
        this._list_panel.append(
            $("<div>").addClass("row")
                .append($("<div>").addClass("col-sm-4")
                    .append($("<input>")
                        .addClass("parameter-label")
                        .addClass("form-control")
                        .attr("type", "text")
                        .attr("placeholder", "Label")
                        .val(label)
                        )
                    )
                .append($("<div>").addClass("col-sm-5")
                    .append($("<select>")
                        .addClass("form-control")
                        .addClass("parameter-value")
                        .append(_parameter.values.map(function (_value) {return $("<option>").text(_value); }))
                        .val(value)
                        .change(function () {
                            axis._checkOptions();
                        })
                        )
                    )
                .append($("<div>").addClass("col-sm-3")
                    .append($("<button>")
                        .addClass("btn btn-danger")
                        .append($("<span>").addClass("glyphicon glyphicon-minus"))
                        .click(function () {
                            $(this).parents(".row").first().remove();
                        })
                        )
                    )
        );
    };
    this._checkOptions = function () {
        var values = this._list_panel.find("select.parameter-value").find("option:selected").map(function (i, element) {return $(element).val(); }).get();
        this._list_panel.find("select.parameter-value").find("option").prop("disabled", function () {return !$(this).is(":selected") && $.inArray($(this).val(), values) >= 0; });
    };
    this.getPanel = function () {
        return this._panel;
    };
    this.getValue = function () {
        var values = [];
        this._list_panel.children(".row").each(function (i, elem) {
            var label = $(elem).find("input.parameter-label").val();
            var value = $(elem).find(".parameter-value").val();
            if (label !== "") {
                values.push({"label": label, "value": value});
            }
        });

        return values;
    };
    this.setValue = function (values) {
        this._clear();
        values.forEach(function (value) {
            axis._appendRow(value.label, value.value);
        });
    };
    this.getReadableValue = function () {
        return _axis.label;
    };

    this._appendRow();
}
