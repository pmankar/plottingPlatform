/*global $,sidebar*/

function MetricSelect(_metrics, _allowNull) {
    "use strict";

    this.element = $("<select>")
        .addClass("form-control")
        .append(_allowNull ? $("<option>").val("-").text("None") : null)
        .append(_metrics.map(function (_metric, i) {return $("<option>").val(i).text(_metric.title); }));

    this.getValue = function () {
        if (this.element.val() === "-") {
            return null;
        }
        return _metrics[this.element.val()];
    };
    this.setValue = function (_value) {
        var i = _metrics.reduce(function (_cur_i, _metric, _i) {return _metric.title === _value.query.title ? _i : _cur_i; }, -1);
        if (i === undefined || i === null) {
            i = "-";
        }
        this.element.val(i);
    };
}

var metrics = {
    _metrics : [],

    show : function (_metrics) {
        "use strict";

        this.hide();
        this._selects = [
            {"name": "query", "label": "Data", "select": new MetricSelect(_metrics, false)},
            {"name": "sort", "label": "Sort", "select": new MetricSelect(_metrics, true)},
        ];
        
        this._panel = sidebar.add("Metric");
        this._panel.getContentPane()
			.append($("<div>").addClass("panel-group")
				.append(this._selects.map(function (select) {
				return 	$("<div>").addClass("form-group")
						.append([$("<label>").text(select.label),select.select.element]);
				}))
			.append($("<div>").addClass("row")
            .append($("<div>").addClass("col-sm-9"))
            .append($("<div>").addClass("col-sm-3")
            .append($("<button>")
                    .addClass("btn btn-danger")
					.append($("<span>").addClass("glyphicon glyphicon-minus"))
                    .click(function () {
                        $(this).parents(".panel-group").first().remove();
                    })
                    ))
				));        

		// added this code below
		var axis = this;
        this._panel.getContentPane()
		this._panel.getContentPane().append($("<div>").addClass("row")
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
		
		this._appendRow = function (label, value) {  
			this._panel.getContentPane()
			.prepend(this._panel.getContentPane().find(".panel-group").first().clone());
			this._panel.getContentPane().find(".panel-group").first().find(".btn-danger").click(function () {
                            $(this).parents(".panel-group").first().remove();
                        })		
		}
		
		// until here
    },
    hide : function () {
        "use strict";

        if (this._panel !== undefined) {
            this._panel.remove();
        }
    },
    getValue : function () {
        "use strict";

        var _value = {};
        this._selects.forEach(function (select) {
            if (select.select.getValue() !== null) {
                _value[select.name] = select.select.getValue();
            }
        });
        return _value;
    },
    setValue : function (_value) {
        "use strict";

        this._selects.forEach(function (select) {
            select.select.setValue(_value[select.name]);
        }.bind(this));
    },
};
