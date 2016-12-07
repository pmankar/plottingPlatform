/*jslint browser: true*/
/*global $,waiting*/

var application = {
    query : function (module, data, callback, timeout) {
        "use strict";

        // shift arguments if data was omitted
        if ($.isFunction(data)) {
            timeout = callback;
            callback = data;
            data = {};
        }

        if (timeout === undefined) {
            timeout = 50;
        }

        var format = "json";
        $.ajax({
            url: module + "." + format,
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data.result === "running") {
                    var _timeout = window.Math.min(3000, timeout * 1.5);
                    window.setTimeout(function () {application.query(module, {"_processid": data._processid}, callback, _timeout); }, _timeout);
                    waiting.show(data.status);
                } else if (data.result === "error") {
                    waiting.hide();
                    // TODO handle error
                    window.alert(data.message);
                } else if (data.result === "ok") {
                    waiting.hide();
                    callback(data.response);
                }
            }
        });
    },
    loadScripts : function (directory) {
        "use strict";

        if (typeof directory === 'string') {
            directory = [directory];
        }
        application.query("/scripts", {"directory": directory.shift()}, function (data) {
            $("body").append(data.map(function (_script) {return $("<script>").attr("src", _script); }));
            if (directory.length > 0) {
                application.loadScripts(directory);
            }
        });
    },
};
