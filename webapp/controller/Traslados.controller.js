sap.ui.define(
  ["./BaseController"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} BaseController
   */
  function (BaseController) {
    "use strict";

    return BaseController.extend(
      "morixe.zmmreemplazodsi.controller.Traslados",
      {
        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          let oTarget = oRouter.getTarget("TargetMovimiento");
          oTarget.attachDisplay(this._onObjectMatched, this);
        },

        _onObjectMatched: function (evt) {
          this._onFocusControl(this.byId("idMovPalletInput"));
        },
        /**
         * @override
         */
        onAfterRendering: function () {
          this._onFocusControl(this.byId("idMovPalletInput"));
        },

        _onResetData: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          oMockModel.setProperty("/Traslado", {
            Tpalletcodigo: "",
            Totnumero: "",
            Tetapa: "",
            Tvalpalletcodigo: "",
            Torigen: "",
            Tvalorigen: "",
            Tdestino: "",
            Tvaldestino: "",
            Tmaterialcodigo: "",
            Tmaterialdesc: "",
            Tcantidad: "",
            Talmacen: "",
          });
        },

        onEtiquetado: function () {

          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oValue =  oMockModel.getProperty("/Etiquetado");
          oMockModel.setProperty("/Etiquetado", !oValue);

        },

        _onShowMsg1: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msguborigen"),
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
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgcodigo"),
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
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgpalletnoesperado"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };
  
          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },
  
        _onShowMsg4: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgubicdiferente"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [
              this._i18n().getText("btnvolver")
             
            ],
            resaltar: this._i18n().getText("btnvolver"),
          };
  
          this._onShowMsgBox(objectMsg).then((rta) => {
            if (rta === "CLOSE") {
            }
          });
        },
  
        _onShowMsg5: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgpalletleido"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [
              this._i18n().getText("btnvolver")
              
            ],
            resaltar: this._i18n().getText("btnconfirm"),
          };
  
          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },
        _onShowMsg6: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgmovok"),
            icono: sap.m.MessageBox.Icon.SUCCESS,
            acciones: [this._i18n().getText("btnvolver"), this._i18n().getText("btnsiguientepos")],
            resaltar: this._i18n().getText("btnvolver"),
          };
  
          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },
  
        _onShowMsg7: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgotconfirmada"),
            icono: sap.m.MessageBox.Icon.SUCCESS,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };
  
          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },

      }
    );
  }
);
