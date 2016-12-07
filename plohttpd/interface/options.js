/*jslint browser: true*/
/*global $,visualisation*/

function Options(optionId, tabs) {
    "use strict";

    var options = this;

    this._getCookieName = function () {
        return "plohttpd.options." + window.btoa(optionId);
    };
    this._loadOptions = function () {
        if ($.cookie(this._getCookieName()) !== undefined) {
            this.setOptions(JSON.parse($.cookie(this._getCookieName())));
        }
    };
    this._saveOptions = function () {
        $.cookie(this._getCookieName(), JSON.stringify(this._options));
    };

    this._showPanel = function () {
        // refresh panel (in case someone hit escape last time)
        this._writeOptions();
        this._panel.modal();
    };
    this._reset = function () {
        tabs.forEach(function (_tab) {
            _tab.controls.forEach(function (_control) {
                _control.control.reset();
            });
        });
    };
    this._apply = function () {
        this._readOptions();
        visualisation.paint(this._options);
        this._panel.modal("hide");
    };
    this._save_apply = function () {
        this._apply();
        this._saveOptions();
    };

    this._selectTab = function (_tab) {
        this._panel.find(".nav-tabs").children("li")
            .removeClass("active")
            .filter(function () {return $(this).data("tab") === _tab; })
            .addClass("active");
        this._panel.find(".tab-content").children(".tab-pane")
            .removeClass("active")
            .filter(function () {return $(this).data("tab") === _tab; })
            .addClass("active");
    };

    this._panel = $("<div>").addClass("modal").append(
        $("<div>").addClass("modal-dialog").append(
            $("<div>").addClass("modal-content").append([
                $("<div>").addClass("modal-header")
                    .append($("<h4>").addClass("modal-title").text("Options")),
                $("<div>").addClass("modal-body")
                    .append($("<form>").addClass("form-horizontal")
                        .append($("<ul>").addClass("nav nav-tabs")
                            .append(tabs.map(function (_tab) {
                                return $("<li>").append($("<a>").text(_tab.label))
                                    .data("tab", _tab.name)
                                    .click(function () {options._selectTab(_tab.name); });
                            }))
                            )
                        .append($("<div>").addClass("tab-content")
                            .append(tabs.map(function (_tab) {
                                return $("<div>").addClass("tab-pane").data("tab", _tab.name)
                                    .append(_tab.controls.map(function (_control) {
                                        return $("<div>").addClass("form-group").append([
                                            $("<label>").addClass("col-sm-3 control-label").text(_control.label),
                                            $("<div>").addClass("col-sm-9").append(_control.control.getFormElement())
                                        ]);
                                    }));
                            }))
                            )
                        ),
                $("<div>").addClass("modal-footer")
                    .append($("<button>").addClass("btn btn-default").text("Reset").click(this._reset.bind(this)))
                    .append($("<button>").addClass("btn btn-default").text("Apply").click(this._apply.bind(this)))
                    .append($("<button>").addClass("btn btn-primary").text("Save and Apply").click(this._save_apply.bind(this)))
            ])
        )
    );
    this._panel.dragdrop({
        anchor: this._panel.find(".modal-header")[0]
    });

    if (tabs.length > 0) {
        this._selectTab(tabs[0].name);

        this.button = $("<button>")
            .addClass("btn btn-default")
            .text("Options")
            .click(this._showPanel.bind(this));
    } else {
        this.button = $("<p>");
    }

    this._readOptions = function () {
        this._options = {};
        tabs.forEach(function (_tab) {
            if (options._options[_tab.name] === undefined) {
                options._options[_tab.name] = {};
            }
            _tab.controls.forEach(function (_control) {
                options._options[_tab.name][_control.name] = _control.control.getValue();
            });
        });
    };
    this._writeOptions = function () {
        tabs.forEach(function (_tab) {
            if (options._options[_tab.name] === undefined) {
                options._options[_tab.name] = {};
            }
            _tab.controls.forEach(function (_control) {
                if (options._options[_tab.name][_control.name] !== undefined) {
                    _control.control.set(options._options[_tab.name][_control.name]);
                }
            });
        });
    };

    this.getOptions = function () {
        return this._options;
    };
    this.setOptions = function (_options) {
        Object.keys(_options).forEach(function (_tab) {
            if (options._options[_tab] === undefined) {
                options._options[_tab] = {};
            }
            if (typeof _options[_tab] === "object") {
                Object.keys(_options[_tab]).forEach(function (_option) {
                    options._options[_tab][_option] = _options[_tab][_option];
                });
            }
        });
        this._writeOptions();
    };

    this._readOptions();
    this._loadOptions();
}
