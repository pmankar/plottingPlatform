/*global $,sidebar,experiment,parameters,filters,metrics,visualisation,application,help*/

var query = {
    reset : function () {
        "use strict";

        help.show("experimentSelect");
        visualisation.hide();
        filters.hide();
        parameters.hide();
        metrics.hide();
        if (this._visualisation_button !== undefined) {
            this._visualisation_button.remove();
        }

        experiment.show();
    },
    onExperimentSelect : function (_string) {
        "use strict";

        application.query("/parameters", {"string": _string}, function (data) {
            filters.show(data.annotations, data.seeds);
            metrics.show(data.metrics);
            parameters.show(data.parameters);

            query._visualisation_button = sidebar.add("Visualize");
            query._visualisation_button.getContentPane().append($("<button>")
                .addClass("btn btn-primary btn-lg pull-right")
                .text("Visualize")
                .click(function () {query.startVisualisation(); })
                );
        });
        help.show("parametersSelect");
    },
    startVisualisation : function (_query, _result, _visualisation) {
        "use strict";

        if (_query === undefined) {
            _query = this.get();
        }
        if (_result === undefined) {
            application.query("/query", _query, function (_result) {
                visualisation.visualize(_query, _result, _visualisation);
            });
        } else {
            visualisation.visualize(_query, _result, _visualisation);
        }
    },
    get : function () {
        "use strict";

        return {
            "filters": filters.getValue(),
            "experiment": experiment.getValue(),
            "parameters": parameters.getValues(),
            "metrics": metrics.getValue(),
        };
    },
    set : function (_query) {
        "use strict";

        filters.setValue(_query.filters);
        experiment.setValue(_query.experiment);
        application.query("/parameters", {"string": _query.experiment}, function (data) {
            parameters.show(data.parameters);
            metrics.show(data.metrics);

            parameters.setValues(_query.parameters);
            metrics.setValue(_query.metric);
        });
    },
};

$(function () {
    "use strict";

    $(".navbar-brand").click(function () {query.reset(); });
});
