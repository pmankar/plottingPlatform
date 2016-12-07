function getLabels(query, axisOrder, axes) {
    "use strict";

    if (axisOrder === undefined) {
        axisOrder = [];
    }

    if (axes === undefined) {
        axes = {};
    }

    if (typeof query === "string") {
        var label = axisOrder.map(function (axis) {return axes[axis]; }).join(" - ");
        return {"axis": axisOrder.join(" - "), "values": [{"label": label, "query": query}]};
    }

    // Simply guess _any_ axis. Only order could be interesting
    var firstAxis = Object.keys(query)[0];
    axisOrder.push(query[firstAxis].parameter.parameter);
    return {
        "axis": axisOrder.join(" - "),
        "values": query[firstAxis].values.reduce(function (labels, cv) {
            axes[query[firstAxis].parameter.parameter] = cv.label;
            var l = getLabels(cv.query, axisOrder, axes);
            return labels.concat(l.values);
        }, [])
    };
}
