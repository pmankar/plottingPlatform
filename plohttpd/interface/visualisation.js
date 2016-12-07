/*global $,application,help,query,exports,Options*/

var visualisation = {
    _currentQuery : {},
    _currentResult : {},
    _currentVisualisation : 0,
    _visualisations : [],
    _optionsButton : $("<span>"),
    _exportButton : $("<span>"),
    _tabrow : $("<ul>").addClass("nav nav-tabs"),
    _paintPanel : $("<div>"),
    _panel : $("<div>"),

    init : function () {
        "use strict";

        this._panel.append([ this._exportButton, this._optionsButton, this._tabrow, this._paintPanel ]);
        this.hide();
    },
    visualize : function (_query, _result, _visualisation) {
        "use strict";

        this.show();
        this._currentQuery = _query;
        this._currentResult = _result;
        this._tabrow.empty().append(
            this._visualisations.map(function (_visualisation, i) {
                return $("<li>")
                    .toggle(_visualisation.guard(visualisation._currentResult))
                    .data("id", i)
                    .click(function () {
                        visualisation.select($(this).data("id"));
                    })
                    .append($("<a>").text(_visualisation.name));
            })
        );
        if (_visualisation !== undefined) {
            var i = this._visualisations.reduce(function (_cur_i, _v, _i) {return _v.name === _visualisation.name ? _i : _cur_i; }, -1);
            this.select(i, _visualisation.options);
        } else {
            // Check if we can reuse currentVisualisation or cycle through.
            // TODO is an endless loop if no matching visualisation exists
            while (this._tabrow.children(":nth-child(" + (this._currentVisualisation + 1) + ")").is(":hidden")) {
                this._currentVisualisation = (this._currentVisualisation + 1) % this._visualisations.length;
            }
            this.select(this._currentVisualisation);
        }
    },
    register : function (_visualisation) {
        "use strict";

        this._visualisations.push(_visualisation);
    },
    select : function (i, _options) {
        "use strict";

        this._tabrow.children("li").removeClass("active");
        this._tabrow.children("li:nth-child(" + (i + 1) + ")").addClass("active");
        this._currentVisualisation = i;
        var v = this._visualisations[this._currentVisualisation];

        var optionControls = v.optionControls !== undefined ? v.optionControls() : [];
        this._options = new Options(v.name, optionControls);
        if (_options !== undefined) {
            this._options.setOptions(_options);
        }

        this._optionsButton
            .toggle(optionControls.length > 0)
            .empty()
            .append(this._options.button.addClass("pull-right"));

        this.paint(this._options.getOptions());
    },
    paint : function (_options) {
        "use strict";

        this._paintPanel.empty();
        this._visualisations[this._currentVisualisation].create(this._paintPanel, this._currentResult, _options);

        this._exportButton.empty().append(exports.getButton(this._currentQuery, this._currentResult, this.getValue(), this._paintPanel).addClass("pull-right"));
    },
    show : function () {
        "use strict";

        help.hideAll();
        this._panel.show();
    },
    hide : function () {
        "use strict";

        this._panel.hide();
    },
    getValue : function () {
        "use strict";

        return {"name": this._visualisations[this._currentVisualisation].name, "options": this._options.getOptions()};
    },
};

$(function () {
    "use strict";

    visualisation.init();
    $(".main").append(visualisation._panel);
});
