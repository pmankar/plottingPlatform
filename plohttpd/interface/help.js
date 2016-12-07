/*global $*/

var help = {
    _panels : {},

    show : function (i) {
        "use strict";

        Object.keys(this._panels).forEach(function (_i) {
            help._panels[_i].toggle(i === _i);
        });
    },
    hideAll : function () {
        "use strict";

        Object.keys(this._panels).forEach(function (_i) {
            help._panels[_i].hide();
        });
    }
};

$(function () {
    "use strict";

    $("*[data-help]").each(function (i, h) {
        help._panels[$(h).data("help")] = $(h);
    });
    help.hideAll();
});
