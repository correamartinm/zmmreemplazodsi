sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("morixe.zmmreemplazodsi.controller.MainView", {
            onInit: function () {

            },
            onGoOtEntrante: function () {
                this.getOwnerComponent().getTargets().display("TargetOtEntrante");
            },
            onGoOtSaliente: function () {
                this.getOwnerComponent().getTargets().display("TargetOtSaliente");
            },
            onGoMovimiento: function () {
                this.getOwnerComponent().getTargets().display("TargetMovimiento");
            },

            onGoMain: function () {
                this.getOwnerComponent().getTargets().display("TargetMainView");
            },

        });
    });
