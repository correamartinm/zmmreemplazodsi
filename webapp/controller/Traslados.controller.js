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

        _onObjectMatched: async function (evt) {
          this.onClearScreen();
          this._onFocusControl(this.byId("idMovPalletInput"));
        },

        onClearScreen: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          oMockModel.setProperty("/Traslado", {
            Pallet: "",
            Destino: "",
          });
          oMockModel.setProperty("/TrasladoSinEtiqueta", {});

          oMockModel.setProperty("/TrasladoScan", {});
          oMockModel.setProperty("/TrasladoSinEtiquetaScan", { Material: "" });
          

          oMockModel.setProperty("/AlmValidTraslado", false);
          oMockModel.setProperty("/AlmValidTrasladoSinEtiqueta", false);

          // this._onObjectMatched();
        },

        onEtiquetado: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oValue = oMockModel.getProperty("/Etiquetado");
          oMockModel.setProperty("/Etiquetado", !oValue);

          if (!oValue === false) {
            let 
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView();

          let oPath = oModel.createKey("/TrasladoSet", {
            Ot: "",
            Posicion: "",
            Pallet: "",
            Accion: "S",
          });

          let rta = await this._onreadModelTraslado(oModel, oView, oPath);
          
          oMockModel.setProperty("/Traslado", rta);
        }

        },

        onBuscarOt: async function () {
          let 
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView();

        let oPath = oModel.createKey("/TrasladoSet", {
          Ot: "",
          Posicion: "",
          Pallet: "",
          Accion: "B",
        });

        let rta = await this._onreadModelTraslado(oModel, oView, oPath);
        
        oMockModel.setProperty("/Traslado", rta);
        },

        onInputPalleScanSubmit: async function (oEvent) {
          let oValue = oEvent.getSource().getValue();

          if (oValue.length < 1) return;

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView();

          let oPath = oModel.createKey("/TrasladoSet", {
            Ot: "",
            Posicion: "",
            Pallet: oValue,
            Accion: "P",
          });

          let rta = await this._onreadModelTraslado(oModel, oView, oPath);
          console.log(rta);

          switch (rta.Tipo) {
            case "01":
              this._onShowMsg1(oEvent);
              break;
            case "02":
              this._onShowMsg2(oEvent);
              break;
            case "03":
              this._onShowMsg3(oEvent);
              break;

            case "":
              this.onLlevarDestino(oEvent);

              break;

            default:
              break;
          }
          oMockModel.setProperty("/Traslado", rta);
        },

        // Ingreso por TrasladoSinEtiqueta  *************************************

        onMaterialScan: function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oValue = oEvent.getSource().getValue(),
            oData = oMockModel.getProperty("/TrasladoSinEtiqueta");
          oMaterial = oData.Cantidad;
          if (oValue !== oMaterial) {
            this._onShowMsg6(oEvent);
          } else {
          }
        },

        onCantidadScan: function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oValue = oEvent.getSource().getValue(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/TrasladoSinEtiqueta");
          oCantidad = oData.Cantidad;
          if (oValue !== oCantidad) {
            this._onShowMsg7(oEvent);
          } else {
            this.onValidTrasladoSinEtiqueta();
          }
        },

        // Ingreso por Datos en comun  ******************************************

        onInputOrigenSubmit: async function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;

          let oValue = oEvent.getSource().getValue(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Traslado");

          if (oValue !== oData.Origen) {
            this._onShowMsg4(oEvent);
          } else {
            // this.onValidTraslado();
          }
        },

        onInputDestinoSubmit: async function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;

          let oValue = oEvent.getSource().getValue(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Traslado");

          if (oValue !== oData.Destino) {
            // this._onShowMsg4(oEvent);
          } else {
            this.onValidTraslado();
          }
        },

        // Validaciones *****************************

        onValidTraslado: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Traslado"),
            oScan = oMockModel.getProperty("/TrasladoScan"),
            oPallet = oData.Pallet,
            oDestino = oData.Destino,
            oPalletScan = oScan.Pallet,
            oDestinoScan = oScan.Destino;
          if (
            oPallet.trim() === oPalletScan.trim() &&
            oDestino.trim() === oDestinoScan.trim()
          ) {
            oMockModel.setProperty("/AlmValidTraslado", true);
          } else {
            oMockModel.setProperty("/AlmValidTraslado", false);
          }
        },

        onTrasladoContinuar: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oTrasladoValues = oMockModel.getProperty("/Traslado");
          oMockModel.setProperty("/Etiquetado", !oValue);
        },

        _onShowMsg1: function () {
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
        _onShowMsg2: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgcodigo"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
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
            if (rta === "CLOSE") {
            }
          });
        },

        _onShowMsg4: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgdestinonoesperado"),
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
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgpalletleido"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
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
            acciones: [
              this._i18n().getText("btnvolver"),
              this._i18n().getText("btnsiguientepos"),
            ],
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
        _onShowMsg8: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgcantidadnoesperada"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [
              this._i18n().getText("btnvolver"),
              this._i18n().getText("btncantmenor"),
            ],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },
        _onShowMsg9: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgeanerror"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },
        _onShowMsg10: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgeanerrormaterial"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            // if (rta === this._i18n().getText("btnvolver")) {
            // }
          });
        },
        _onShowMsg11: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgrepetir"),
            icono: sap.m.MessageBox.Icon.QUESTION,
            acciones: [
              this._i18n().getText("btnvolver"),
              this._i18n().getText("btnrepetir"),
            ],
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
