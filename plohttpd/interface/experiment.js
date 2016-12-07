/*jslint browser: true*/
/*global $,sidebar,application,query,parameters,metrics,help,exports*/

var experiment = {
    _experiments : {},
    _currentExperimentString : null,
    buttonExperimentList : $("<button>").addClass("btn btn-default").text("Show experiments")
        .click(function () {
            "use strict";

            application.query("/experiment_list", function (experiment_list) {
                var _experiments = experiment_list.reduce(
                    function (_experiments, _experiment) {
                        if (_experiments[_experiment.string] === undefined) {
                            _experiments[_experiment.string] = {"seeds": []};
                        }
                        if (_experiments[_experiment.string].seeds.indexOf(_experiment.seed) === -1) {
                            _experiments[_experiment.string].seeds.push(_experiment.seed);
                        }
                        return _experiments;
                    },
                    {}
                );

                var modal = $("<div>").addClass("modal").append(
                    $("<div>").addClass("modal-dialog").append(
                        $("<div>").addClass("modal-content").append([
                            $("<div>").addClass("modal-header")
                                .append($("<h4>").addClass("modal-title").text("Experiments")),
                            $("<div>").addClass("modal-body")
                                .append($("<table>").addClass("table table-striped")
                                    .append($("<thead>")
                                        .append($("<tr>")
                                            .append([
                                                $("<th>").text("Experiment"),
                                                $("<th>").text("Seeds")
                                            ])
                                            )
                                        )
                                    .append($("<tbody>")
                                        .append(Object.keys(_experiments).map(function (_string) {
                                            return $("<tr>").append([
                                                $("<td>").text(_string),
                                                $("<td>").text(_experiments[_string].seeds.join(", "))
                                            ]);
                                        }))
                                        )
                                    ),
                            $("<div>").addClass("modal-footer")
                                .append($("<button>").addClass("btn btn-primary").text("Close").click(function () {modal.modal("hide"); }))
                        ])
                    )
                );
                modal.dragdrop({
                    anchor: modal.find(".modal-header")[0]
                });
                modal.modal();
            });
        }),

    init : function () {
        "use strict";

        this._panel = sidebar.add("Experiment");
        this._panel.onClick(function () {query.reset(); });
        application.query("/experiments", function (data) {
            experiment._experiments = data.experiments;
            query.reset();
            if (data.import !== undefined && data.import !== null) {
                // This is a really dirty hack. Do not even think about copying it.
                window.setTimeout(function () {exports.do_import(data.import); }, 50);
            }
        });
    },
    show : function () {
        "use strict";

        this._currentExperimentString = null;

        var experimentSelect, experimentInput;
        experimentSelect = $("<select>").attr("id", "experiment").addClass("form-control")
            .append($("<option>").attr("value", "").text("Please select"))
            .append(this._experiments.map(function (_experiment, i) {return $("<option>").attr("value", i).text(_experiment.name); }))
            .append($("<option>").attr("value", "").text("Userdefined"))
            .change(function () {
                var val = $(this).val();
                if (val !== "") {
                    var _experiment = experiment._experiments[val];
                    experiment.select(_experiment.name, _experiment.string);
                } else {
                    $(this).hide();
                    experimentInput.show().focus();
                }
            });
        experimentInput = $("<input>").attr("type", "text").addClass("form-control").hide()
            .keyup(function (e) {
                if (($(this).val() === "" && e.keyCode === 13) || e.keyCode === 27) {
                    $(this).hide();
                    experimentSelect.val("").show().focus();
                }
            })
            .change(function () {
                if ($(this).val() !== "") {
                    experiment.select($(this).val(), $(this).val());
                }
            });
        this._panel.getContentPane().empty().append(experimentSelect, experimentInput);
        this._panel.show();
        experimentSelect.focus();
    },
    showVisualisation : function (label, string) {
        "use strict";

        this._currentExperimentString = string;
        this._panel.getContentPane().empty().append(label);
    },
    select : function (label, string) {
        "use strict";

        this.showVisualisation(label, string);
        query.onExperimentSelect(string);
    },
    getValue : function () {
        "use strict";

        return this._currentExperimentString;
    },
    setValue : function (_string) {
        "use strict";

        if (_string !== this._currentExperimentString) {
            var predefined = this._experiments.filter(function (_experiment, i) {return _experiment.string === _string; })[0];
            if (predefined !== undefined) {
                this.showVisualisation(predefined.name, predefined.string);
            } else {
                this.showVisualisation(_string, _string);
            }
        }
    },
};

$(function () {
    "use strict";

    experiment.init();
    $(".experimentlist").append(experiment.buttonExperimentList);
});
