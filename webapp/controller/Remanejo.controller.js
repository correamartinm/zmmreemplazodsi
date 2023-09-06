sap.ui.define(
  ["./BaseController",  "sap/ui/core/ValueState"],
  
  /**
   * @param {typeof sap.ui.core.mvc.BaseController} BaseController
   * @param {typeof sap.ui.core.ValueState} ValueState
   */
  function (BaseController, ValueState) {
    "use strict";

    return BaseController.extend("morixe.zmmreemplazodsi.controller.Remanejo", {
      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        let oTarget = oRouter.getTarget("TargetMovimiento");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },

      _onObjectMatched: function (evt) {
        this._onFocusControl(this.byId("idMovPalletInput"));
      },

      _onResetData: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/Remanejo", {
          Rpalletcodigo: "",
          Totnumero: "",
          Tnuevonumero: "",
        });
      },

      _onGotoMainMenu: function () {
        let objectMsg = {
          titulo: this._i18n().getText("msgconsulta"),
          mensaje: this._i18n().getText("msgvolver"),
          icono: sap.m.MessageBox.Icon.QUESTION,
          acciones: [sap.m.MessageBox.Action.CLOSE, sap.m.MessageBox.Action.OK],
          resaltar: sap.m.MessageBox.Action.OK,
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === "OK") {
            this._onResetData();
            this.onGoMain();
          }
        });
      },
    });
  }
);
