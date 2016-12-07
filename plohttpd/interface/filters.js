/*global $,sidebar*/

var filters = {
    _annotations : [],
    _seeds : [],

    show : function (annotations, seeds) {
        "use strict";

        this.hide();
        this._annotations = annotations;
        this._seeds = seeds;

        this._panel = sidebar.add("Filters");
        this._panel.getContentPane().append([
            $("<h4>").text("Annotations"),
            $("<div>").addClass("annotations").append(annotations.map(function (_annotation) {
                return $("<div>").addClass("checkbox").append(
                    $("<label>").append([
                        $("<input>").attr("type", "checkbox").prop("checked", true)
                            .val(_annotation)
                            .attr("title", _annotation),
                        _annotation
                    ])
                );
            })),
            $("<h4>").text("Seeds"),
            $("<div>").addClass("seeds").append(seeds.map(function (_seed) {
                return $("<div>").addClass("checkbox").append(
                    $("<label>").append([
                        $("<input>").attr("type", "checkbox").prop("checked", true)
                            .val(_seed)
                            .attr("title", _seed),
                        _seed
                    ])
                );
            })),
        ]);
    },
    hide : function () {
        "use strict";

        if (this._panel !== undefined) {
            this._panel.remove();
        }
    },
    getValue : function () {
        "use strict";

        var annotations = filters._panel.getContentPane().find(".annotations").find("input:checked").map(function () {return $(this).val(); }).get();
        var seeds = filters._panel.getContentPane().find(".seeds").find("input:checked").map(function () {return $(this).val(); }).get();
        return {"annotations": annotations, "seeds": seeds};
    },
    setValue : function (_value) {
        "use strict";

        var i;

        this._panel.getContentPane().find(".annotations").find("input").prop("checked", false);
        for (i = 0; i < _value.annotations.length; i = i + 1) {
            this._panel.getContentPane().find(".annotations").find("input").filter(":eq(" + this._annotations.indexOf(_value.annotations[i]) + ")").prop("checked", true);
        }
        this._panel.getContentPane().find(".seeds").find("input").prop("checked", false);
        for (i = 0; i < _value.seeds.length; i = i + 1) {
            this._panel.getContentPane().find(".seeds").find("input").filter(":eq(" + this._seeds.indexOf(_value.seeds[i]) + ")").prop("checked", true);
        }
    },
};
