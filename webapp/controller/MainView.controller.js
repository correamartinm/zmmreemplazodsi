sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("morixe.zmmreemplazodsi.controller.MainView", {
      onInit: function () {},

      onReiniciar: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");

        oMockModel.setProperty("/MainButtons", false);
      },

      onGoOtEntranteOLV: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oCenter = oMockModel.setProperty("/ActiveCenter", "OLV");
        oMockModel.setProperty("/MainButtons", true);
      },
      onGoOtEntranteCBA: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oCenter = oMockModel.setProperty("/ActiveCenter", "CBA");
        oMockModel.setProperty("/MainButtons", true);
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
      onGoRemanejo: function () {
        this.getOwnerComponent().getTargets().display("TargetRemanejo");
      },

      onGoMain: function () {
        this.getOwnerComponent().getTargets().display("TargetMainView");
      },
    });
  }
);
