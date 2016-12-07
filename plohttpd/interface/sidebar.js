/*global $*/

function SidebarPanel(title) {
    "use strict";

    this._inner_panel = $("<div>").addClass("panel-body");
    this._panel = $("<div>").addClass("panel panel-default")
        .append([
            $("<div>")
                .addClass("panel-heading")
                .append($("<h4>").addClass("panel-title").text(title)),
            $("<div>")
                .addClass("panel-collapse")
                    .append(this._inner_panel)
        ]);

    this.setTitle = function (title) {
        this._panel.find(".panel-title").text(title);
    };
    this.show = function () {
        this._panel.show();
    };
    this.remove = function () {
        this._panel.remove();
    };
    this.onClick = function (callback) {
        this._panel.find(".panel-heading").css("cursor", "pointer").click(callback.bind(this));
    };
    this.getPanel = function () {
        return this._panel;
    };
    this.getContentPane = function () {
        return this._inner_panel;
    };
}

var sidebar = {
    _sidebar : $("#sidebar").addClass("panel-group"),

    add : function (title, clickCallback) {
        "use strict";
        
        var panel = new SidebarPanel(title, clickCallback);
        this._sidebar.append(panel.getPanel());
        return panel;
    },
};
