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
          oMockModel.setProperty("/TrasladoScan", {});
          oMockModel.setProperty("/Etiquetado", true);
          oMockModel.setProperty("/AlmValidTraslado", false);
          oMockModel.setProperty("/AlmValidTrasladoSinEtiqueta", false);

          // this._onObjectMatched();
        },

        onEtiquetado: async function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oValue = oMockModel.getProperty("/Etiquetado");
          oMockModel.setProperty("/Etiquetado", !oValue);

          if (!oValue === false) {
            let oModel = this.getOwnerComponent().getModel(),
              oView = this.getView();

            let oPath = oModel.createKey("/TrasladoSet", {
              Ot: "",
              Posicion: "",
              Pallet: "",
              Accion: "S",
            });

            let rta = await this._onreadModelTraslado(oModel, oView, oPath);
            if (rta !== undefined) {
              rta.Accion = "S";
              oMockModel.setProperty("/Traslado", rta);
            }
            this._onFocusControl(this.byId("idTraPalletMaterial"));
          } else {
            this.onClearScreen();
            this._onFocusControl(this.byId("idMovPalletInput"));
          }
        },

        onBuscarOt: async function () {
          let oModel = this.getOwnerComponent().getModel(),
            oView = this.getView();

          let oPath = oModel.createKey("/TrasladoSet", {
            Ot: "",
            Posicion: "",
            Pallet: "",
            Accion: "B",
          });

          let rta = await this._onreadModelTraslado(oModel, oView, oPath);

          if (rta !== undefined) {
            rta.Accion = "B";
            oMockModel.setProperty("/Traslado", rta);
          }
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
          this.onShowMessagesTraslado(rta);

          if (rta !== undefined) {
            rta.Accion = "P";
            oMockModel.setProperty("/Traslado", rta);
          }
        },

        // Ingreso por TrasladoSinEtiqueta  *************************************

        onMaterialScan: async function (oEvent) {
          // va read MaterialesSet con lo que vino en el servicio + el scaneo

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oValue = oEvent.getSource().getValue(),
            oData = oMockModel.getProperty("/Traslado");
          oDataScan = oMockModel.getProperty("/TrasladoScan");
          oMaterial = oData.Material;

          let oPath = oModel.createKey("/MaterialSet", {
            MaterialScan: oMaterial,
            Ean11: oValue,
          });

          let rta = await this._onreadModelMaterial(oModel, oView, oPath);

          if (rta.Respuesta === "OK") {
            oDataScan.Cantidad = parseInt(oDataScan.Cantidad) + 1;
            oDataScan.Cantidad = oDataScan.Cantidad.toString();
            oMockModel.setProperty("/TrasladoScan", oDataScan);
          }
          if (oDataScan.Cantidad === oData.Cantidad) {
            this._onFocusControl(this.byId("idTraDestino"));
          } else {
            oEvent.getSource().setValue("");
            this._onFocusControl(this.byId(oEvent.getSource()));
          }
        },

        onCantidadScan: function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oValue = oEvent.getSource().getValue(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/Traslado");
          oCantidad = oData.Cantidad;

          if (oValue !== oCantidad) {
            this._onShowMsg8(oEvent);
          } else {
            this._onFocusControl(this.byId("idTraDestino"));
          }
        },

        // Ingreso por Datos en comun  ******************************************

        onInputOrigenSubmit: async function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;

          let oValue = oEvent.getSource().getValue(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Traslado");

          if (oValue !== oData.Origen) {
            this._onShowMsg12(oEvent);
          } else {
            this._onFocusControl(this.byId("idTraDestino"));
          }
        },

        onInputDestinoSubmit: async function (oEvent) {
          // Read DestinoValidacionSet

          if (oEvent.getSource().getValue().length < 1) return;

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oValue = oEvent.getSource().getValue(),
            oData = oMockModel.getProperty("/Traslado");
          oDataScan = oMockModel.getProperty("/TrasladoScan");
          oMaterial = oData.Material;

          let oPath = oModel.createKey("/DestinoValidacionSet", {
            Ot: oData.Ot,
            Posicion: oData.Posicion,
            Pallet: oData.Pallet,
            Accion: oData.Accion,
            Destino: oValue,
          });

          let rta = await this._onreadModelMaterial(oModel, oView, oPath);

          if (rta.Respuesta === "OK") {
            if (rta.Datos.Tipo === "") {
              this.onValidarMovimiento();
            } else {
              this.onShowMessagesTraslado(rta.Datos);
            }
          }
        },

        onValidarMovimiento: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Etiquetado");

          if (oData === true) {
            this.onValidTraslado();
          } else {
            this.onValidTrasladoSinEtiqueta();
          }
        },

        // Validaciones *****************************

        onValidTraslado: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Traslado"),
            oScan = oMockModel.getProperty("/TrasladoScan"),
            oPallet = oData.Pallet,
            oOrigen = oData.Origen,
            oDestino = oData.Destino,
            oPalletScan = oScan.Pallet,
            oOrigenScan = oScan.Origen,
            oDestinoScan = oScan.Destino;

          if (
            oPallet.trim() === oPalletScan.trim() &&
            oOrigen.trim() === oOrigenScan.trim() &&
            oDestino.trim() === oDestinoScan.trim()
          ) {
            oMockModel.setProperty("/AlmValidTraslado", true);
          } else {
            oMockModel.setProperty("/AlmValidTraslado", false);
          }
        },

        onValidTrasladoSinEtiqueta: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Traslado"),
            oScan = oMockModel.getProperty("/TrasladoScan"),
            oMaterial = oData.Ean11,
            oCantidad = oData.Cantidad,
            oOrigen = oData.Origen,
            oDestino = oData.Destino,
            oMaterialScan = oScan.Material,
            oCantidadScan = oScan.Cantidad,
            oDestinoScan = oScan.Destino,
            oOrigenScan = oScan.Origen;

          if (
            oMaterial.trim() === oMaterialScan.trim() &&
            oCantidadScan.trim() === oCantidad.trim() &&
            oOrigen.trim() === oOrigenScan.trim() &&
            oDestino.trim() === oDestinoScan.trim()
          ) {
            oMockModel.setProperty("/AlmValidTrasladoSinEtiqueta", true);
          } else {
            oMockModel.setProperty("/AlmValidTrasladoSinEtiqueta", false);
          }
        },

        onTrasladoContinuar: async function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oEntity = "/AlmacenamientoSet",
            oPayload = oMockModel.getProperty("/Traslado");
          let rta = await this._oncreateModel(oModel, oView, oEntity, oPayload);
          if (rta !== undefined) this.onShowMessagesTraslado(rta);
        },

        onShowMessagesTraslado: function (rta) {
          switch (rta.Tipo) {
            case "01":
              this._onShowMsg1();
              break;
            case "02":
              this._onShowMsg2();
              break;

            case "05":
              this._onShowMsg5();
              break;
            case "06":
              this._onShowMsg6();
              break;

            case "07":
              this._onShowMsg7();
              break;

            default:
              break;
          }
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
            this.onClearScreen();
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
            this.onClearScreen();
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

        _onShowMsg4: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgdestinonoesperado"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
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
            if (rta === this._i18n().getText("btnvolver")) {
              this.onClearScreen();
            } else {
              this.onClearScreen();
              this.onBuscarOt();
            }
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
            this.onClearScreen();
          });
        },
        _onShowMsg8: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgcantidadnoesperada"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [
              this._i18n().getText("btnvolver"),
              this._i18n().getText("btncantmenor"),
            ],
            resaltar: this._i18n().getText("btncantmenor"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            if (rta === this._i18n().getText("btnvolver")) {
              this.onClearScreen();
            } else {
              oEvent.getSource().setValue("");
              this._onFocusControl(oEvent.getSource());
            }
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
        _onShowMsg10: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msgeanerrormaterial"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
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
        _onShowMsg12: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lbltraslado"),
            mensaje: this._i18n().getText("msguborigen"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          });
        },
      }
    );
  }
);
