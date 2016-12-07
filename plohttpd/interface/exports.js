/*jslint browser: true*/
/*global $,visualisation,application,query,Options*/

var exports = {
    _fileInput : $("<input>")
        .attr("type", "file")
        .change(function () {
            "use strict";

            var fileReader = new window.FileReader();
            fileReader.onload = function (e) {
                exports.do_import(JSON.parse(fileReader.result));
            };
            fileReader.readAsText(this.files[0]);
        }),
    buttonImport : $("<button>").addClass("btn btn-default").text("Import")
        .click(function () {
            "use strict";

            exports._fileInput.click();
        }),

    do_import : function (data) {
        "use strict";

        query.set(data.query);
        query.startVisualisation(data.query, data.result, data.visualisation);
    },

    exportAll : function () {
        "use strict";

        var svgs = {};
        visualisation._visualisations.forEach(function (_visualisation) {
            if (_visualisation.guard(visualisation._currentResult)) {
                var _panel = $("<div>");
                var _optionControls = _visualisation.optionControls !== undefined ? _visualisation.optionControls() : [];
                _visualisation.create(_panel, visualisation._currentResult, (new Options(_visualisation.name, _optionControls)).getOptions());

                if (_panel.children("svg:only-child").length === 1) {
                    svgs[_visualisation.name] = _panel.html();
                }
            }
        });

        application.query("export", {"format": "zip", "data": JSON.stringify(svgs)}, function (_data) {
            window.location = _data.location;
        });
    },

    getButton : function (_currentQuery, _currentData, _currentVisualisation, _paintPanel) {
        "use strict";

        var _exportOptions = [];

        _exportOptions.push({"title": "Save (Query)", "local": {"mime": "application/json", "data": JSON.stringify({"query": _currentQuery, "visualisation": _currentVisualisation})}});
        _exportOptions.push({"title": "Save (Results)", "local": {"mime": "application/json", "data": JSON.stringify({"query": _currentQuery, "result": _currentData, "visualisation": _currentVisualisation})}});

        var v = visualisation._visualisations[visualisation._currentVisualisation];
        if (v.ploshModule !== undefined) {
            var _options = visualisation._options.getOptions();
            _exportOptions.push({"title": "PloSH: Query", "local": {"mime": "application/json", "data": JSON.stringify({"query": _currentQuery, "visualisation": {"module": v.ploshModule, "options": _options}})}});
            _exportOptions.push({"title": "PloSH: Results", "local": {"mime": "application/json", "data": JSON.stringify({"result": _currentData, "visualisation": {"module": v.ploshModule, "options": _options}})}});
        }

        if (_paintPanel.children("svg:only-child").length === 1) {
            _exportOptions.push({"title": "SVG", "local": {"mime": "text/svg", "data": _paintPanel.html()}});
            _exportOptions.push({"title": "PDF", "remote": {"format": "pdf", "data": _paintPanel.html()}});
        }

        return $("<div>").addClass("btn-group")
            .append($("<button>")
                .addClass("btn btn-info dropdown-toggle")
                .attr("data-toggle", "dropdown")
                .text("Export ")
                .append($("<span>").addClass("caret"))
                )
            .append($("<ul>")
                .addClass("dropdown-menu")
                .append(_exportOptions.map(function (option) {
                    var _link = $("<a>");

                    if (option.local !== undefined) {
                        _link
                            .attr("href", "data:" + option.local.mime + ";base64," + window.btoa(option.local.data))
                            .prop("download", true);
                    }
                    if (option.remote !== undefined) {
                        _link
                            .click(function () {
                                application.query("/export", option.remote, function (_data) {
                                    window.location = _data.location;
                                });
                            });
                    }

                    return $("<li>").append(_link.text(option.title));
                }))
                .append($("<li>").addClass("divider"))
                .append($("<li>").append(
                    $("<a>")
                        .text("All (SVG & PDF)")
                        .click(function () {
                            exports.exportAll();
                        })
                ))
                );
    },
};

$(function () {
    "use strict";

    $(".import").append(exports.buttonImport);
});
