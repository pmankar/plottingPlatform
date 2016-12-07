/*global visualisation,$*/

visualisation.register({
    name: "Informationtext",
    guard : function (result) {
        "use strict";

        return true;
    },
    create: function (panel, result, options) {
        "use strict";

        panel.append($("<p>")
            .append("In the upper right corner you will find the option button, to personalize your graphic. <br> The size of the graphic, padding and font are adjustable from the XY tab. <br> Turning on/off and positioning the legend in/outside or manually in the graphic as well as the font, titel, borders and padding can be done from the Legend tab. <br> Colors, symbols and Titel can be changed from the Tab with the graphic name. <br> By selecting Export also in the upper right corner, you can export your experiment and parameterdefined settings as a pdf or svg. Note that, this will export only the graphic you have selected in the tab menu. All allows you to export all experiments, in bouth svg and pdf. You also have the option to export the Query and Result, usefull when working on large amounts of data.")
            .append(options)
            );
            
    }
});
