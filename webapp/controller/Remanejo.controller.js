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

      onAgregarButtonPress: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/Remanejo", 3);
      },
      onAgregarSeleccionButtonPress: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/Remanejo", 1);
      },

      onCancelarSeleccionButtonPress: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/Remanejo", 1);
      },
      _onShowMsg1: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgtraslote"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          // if (rta === this._i18n().getText("btnvolver")) {
          // }
        });
      },

      _onShowMsg2: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgtrascantidad"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [
            this._i18n().getText("btnvolver")          ],
          resaltar: this._i18n().getText("btnconfirm"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === "CLOSE") {
          }
        });
      },

      _onShowMsg3: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgmover"),
          icono: sap.m.MessageBox.Icon.QUESTION,
          acciones: [this._i18n().getText("btnvolver"), this._i18n().getText("btnmover")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          // if (rta === this._i18n().getText("btnvolver")) {
          // }
        });
      },
      _onShowMsg4: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("lblnuevonumeroplt"),
          icono: sap.m.MessageBox.Icon.SUCCESS,
          acciones: [this._i18n().getText("btnimprimir")],
          resaltar: this._i18n().getText("btnimprimir"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          // if (rta === this._i18n().getText("btnvolver")) {
          // }
        });
      },

    });
  }
);
