/*global $*/

var fullscreen = {
    _panel : $("<div>").addClass("fullscreen").hide(),

    show : function (_panel) {
        "use strict";

        this._panel.append(_panel);
        this._panel.fadeIn(300);
    },
    hide : function (_panel) {
        "use strict";

        _panel.detach();
        if (this._panel.children().length === 0) {
            this._panel.fadeOut(300);
        }
    }
};

$(function () {
    "use strict";

    $("body").append(fullscreen._panel);
});
