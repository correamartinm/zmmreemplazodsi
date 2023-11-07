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

        _onObjectMatched: async function (evt) {
          let oModel = this.getOwnerComponent().getModel(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oView = this.getView(),
            oEntity = "/DevolucionSet",
            rta,
            oFilters = [];

          let oPath = oModel.createKey("/DevolucionSet", {
            Pallet: "1234",
          });

          //  rta = await this._onfilterModel(oModel, oView, oEntity, oFilters);

          rta = await this._onreadModel(oModel, oView, oPath);
          debugger;

          if (rta.length > 0) {
            oMockModel.setProperty("/Devolucion", rta);
            oMockModel.setProperty("/EtiquIngxPallets", false);
            this.onIngresaxPallet();
          } else {
            this._onFocusControl(this.getView().byId("idAlmPalletScan"));
          }
        },
        onClearScreen: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          oMockModel.setProperty("/Almacenamiento", {});
          oMockModel.setProperty("/Devolucion", {});
          oMockModel.setProperty("/EtiquIngxPallets", false);
          this.getView().byId("idAlmPalletScan").setValue(null);
          this.getView().byId("idAlmDestinoScan").setValue(null);
          this.getView().byId("idAlmDevPalletMaterial").setValue(null);
          this.getView().byId("idAlmDevPalletCantidad").setValue(null);
          this.getView().byId("idAlmDevDestinoScan").setValue(null);

          this._onFocusControl(this.getView().byId("idAlmPalletScan"));


        },

        onIngresaxPallet: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oValue = oMockModel.getProperty("/EtiquIngxPallets");
          oMockModel.setProperty("/EtiquIngxPallets", !oValue);
          if (!oValue === true) {
            this._onFocusControl(this.getView().byId("idDevPalletMaterial"));
          } else {
            this._onFocusControl(this.getView().byId("idAlmPalletScan"));
          }
        },

        onInputPalleScanSubmit: async function (oEvent) {
          let oValue = oEvent.getSource().getValue();

          if (oValue.length < 1) return;

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView();

          let oPath = oModel.createKey("/AlmacenamientoSet", {
            Pallet: oValue,
          });

          let rta = await this._onreadModel(oModel, oView, oPath, oEvent);
          debugger;

          switch (rta.TipoMensaje) {
            case "1":
              this._onShowMsg1(oEvent);
              break;
            case "2":
              this._onShowMsg2(oEvent);
              break;
            case "3":
              this._onShowMsg3(oEvent);
              break;

            default:
              break;
          }
          oMockModel.setProperty("/Almacenamiento", rta);
        },

        onInputDestinoSubmit: async function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;

          let oValue = oEvent.getSource().getValue(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/Almacenamiento"),
            oPath = oModel.createKey("/AlmacenamientoSet", {
              Pallet: oData.Pallet,
            });

          if (oValue !== oData.Destino) {
            oEvent.getSource().setValue(null);
            this._onFocusControl(oEvent.getSource());
          } else {
            // *******************************************
            let rta = this._onreadModel(oModel, oView, oPath);
            debugger;
            oMockModel.setProperty("/Almacenamiento", {});
          }
        },

        onMaterialScan: function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oValue = oEvent.getSource().getValue(),
            oData = oMockModel.getProperty("/Devolucion");
          oMaterial = oData.Cantidad;
          if (oValue !== oMaterial) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          } else {
          }
        },

        onCantidadScan: function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oValue = oEvent.getSource().getValue(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/Devolucion");
          oCantidad = oData.Cantidad;
          if (oValue !== oCantidad) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          } else {
          }
        },

        onDestinoScan: function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oValue = oEvent.getSource().getValue(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/Almacenamiento");
          oDestino = oData.Destino;
          if (oValue !== oDestino) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          } else {
          }
        },

        onConfirmaAlmacenamiento: function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oValue = oEvent.getSource().getValue(),
            oData = oMockModel.getProperty("/Almacenamiento");
          oMaterial = oData.Cantidad;
          if (oValue !== oMaterial) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          } else {
          }
        },

        onConfirmaDevolucion: function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oValue = oEvent.getSource().getValue(),
            oData = oMockModel.getProperty("/Devolucion");
          oMaterial = oData.Cantidad;
          if (oValue !== oMaterial) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          } else {
          }
        },

        _onShowMsg1: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgpltnoot"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          });
        },

        _onShowMsg2: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgcodigo"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          });
        },

        _onShowMsg3: function (oEvent) {
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
      }
    );
  }
);
