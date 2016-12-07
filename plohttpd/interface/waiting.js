/*global $,fullscreen*/

var waiting = {
    _panel : $("<div>").addClass("waiting")
        .append($("<img>").attr("src", "loading.gif"))
        .append(
            $("<div>").addClass("progress").append(
                $("<div>")
                    .addClass("progress-bar")
                    .attr("role", "progressbar")
                    .attr("aria-valuemin", "0")
                    .attr("aria-valuemax", "100")
                    .append($("<span>")
                        .addClass("sr-only")
                        .text("-")
                        )
            )
        )
        .append($("<ul>").addClass("messages")),

    _setProgress : function (progress) {
        "use strict";

        this._panel.find(".progress").toggle(progress !== undefined);
        if (progress === undefined) {
            progress = 0;
        }
        if (this._panel.find(".progress").find(".progress-bar").attr("aria-valuenow") !== String(100 * progress)) {
            this._panel.find(".progress").find(".progress-bar").attr("aria-valuenow", 100 * progress).stop(true, true).animate({"width": (100 * progress) + "%"});
        }
    },
    hide : function () {
        "use strict";

        fullscreen.hide(this._panel);
        this._setProgress(undefined);
    },
    show : function (status) {
        "use strict";

        fullscreen.show(this._panel);

        this._panel.find(".messages").empty();
        if (status.messages !== undefined) {
            status.messages.forEach(function (message) {
                waiting._panel.find(".messages").append($("<li>").text(message));
            });
        }

        this._setProgress(status.progress);
    }
};
