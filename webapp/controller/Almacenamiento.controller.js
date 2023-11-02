sap.ui.define(
  ["./BaseController", "sap/ui/core/ValueState"],
  /**
   * @param {typeof sap.ui.core.mvc.BaseController} BaseController
   * @param {typeof sap.ui.core.ValueState} ValueState
   */
  function (BaseController, ValueState) {
    "use strict";

    return BaseController.extend(
      "morixe.zmmreemplazodsi.controller.Almacenamiento",
      {
        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          let oTarget = oRouter.getTarget("TargetOtEntrante");
          oTarget.attachDisplay(this._onObjectMatched, this);
        },

        _onObjectMatched: function (evt) {
          this._onFocusControl(this.byId("idOtInPalletInput"));
        },
        _onResetData: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          oMockModel.setProperty("/Almacenamiento", {});
        },

        _onShowMsg1: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgpltnoot"),
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
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgubcincompatible"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },

        _onShowMsg3: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgpalletcontenido"),
            icono: sap.m.MessageBox.Icon.QUESTION,
            acciones: [
              this._i18n().getText("btnvolver"),
              this._i18n().getText("btnllevardestino"),
              this._i18n().getText("btnllevarremanejo"),
            ],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            if (rta === "CLOSE") {
            }
          });
        },

        _onShowMsg4: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgcodigo"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },

        _onShowMsg5: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgmovok"),
            icono: sap.m.MessageBox.Icon.SUCCESS,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },
        _onShowMsg6: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgmaterialnoesperado"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },
        _onShowMsg7: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgcantidadnoesperada"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },

        onIngresaxPallet: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oValue = oMockModel.getProperty("/EtiquIngxPallets");
          oMockModel.setProperty("/EtiquIngxPallets", !oValue);
        },

        onInputScanSubmit: async function (oEvent) {
          let oValue = oEvent.getSource().getValue();

          if (oValue.length < 1) return;

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView();

          let oPath = oModel.createKey("/AlmacenamientoSet", {
            Pallet: oValue,
          });

          let rta = this._onreadModel(oModel, oView, oPath);
          debugger;
          oMockModel.setProperty("/Almacenamiento", rta.results);
        },

        onInputDestinoSubmit: async function (oEvent) {
          let oValue = oEvent.getSource().getValue();

          if (oValue.length < 1) return;

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/Almacenamiento");
            let oPath = oModel.createKey("/AlmacenamientoSet", {
              Pallet: oData.Pallet,
          });

          if (oValue === oData.Destino) {
            
          // *******************************************
          let rta = this._onreadModel(oModel, oView, oPath);
          debugger;
          oMockModel.setProperty("/Almacenamiento", {});

        } else {
          oEvent.getSource().setValue(null);
          this._onFocusControl(oEvent.getSource());
          
        }

        },




      }
    );
  }
);
