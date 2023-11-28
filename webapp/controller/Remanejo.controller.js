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

// Mensajes ***************************
onShowMessagesTraslado: function (rta, oEvent) {
  switch (rta.Tipo) {
    case "01":
      this._onShowMsg1();
      break;
    case "02":
      this._onShowMsg2();
      break;
    case "03":
      this._onShowMsg3();
      break;
    case "04":
      this._onShowMsg4(oEvent);
      break;
    case "05":
      this._onShowMsg5(oValue);
      break;
    case "06":
      this._onShowMsg6();
      break;
    case "07":
      this._onShowMsg7();
      break;
    case "08":
      this._onShowMsg8();
      break;
 
    default:
      break;
  }
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
          resaltar: this._i18n().getText("btnvolver"),
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

      _onShowMsg5: function (oValue) {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgnuevonum") +" "+ oValue,
          icono: sap.m.MessageBox.Icon.SUCCESS,
          acciones: [this._i18n().getText("btnimprimir")],
          resaltar: this._i18n().getText("btnimprimir"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          // if (rta === this._i18n().getText("btnvolver")) {
          // }
        });
      },

      _onShowMsg6: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgcantidad"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [
            this._i18n().getText("btnvolver")          ],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === "CLOSE") {
          }
        });
      },

      _onShowMsg7: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgexiste"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [
            this._i18n().getText("btnvolver")          ],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === "CLOSE") {
          }
        });
      },

      _onShowMsg8: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgcodigonomaterial"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [
            this._i18n().getText("btnvolver")          ],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === "CLOSE") {
          }
        });
      },

    });
  }
);
