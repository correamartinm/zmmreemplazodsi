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

          this._onFocusControl(this.byId("idMovPalletInput"));
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

            if (rta.Respuesta === "OK") {
              rta.Datos.Accion = "S";
              oMockModel.setProperty("/Traslado", rta.Datos);
              this._onValidaComportamiento(oMockModel, rta.Datos, []);
            } else {
              this._onErrorHandle(rta.Datos);
            }
            oMockModel.setProperty("/TrasladoMaterialValidado", true);
            this._onFocusControl(this.byId("idTraPalletMaterial"));
          } else {
            this.onClearScreen();
          }
        },

        onInputPalleScanSubmit: async function (oEvent) {
          let oValue = oEvent.getSource().getValue();

          if (oValue.length < 1) return;

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oDataScan = oMockModel.getProperty("/TrasladoScan"),
            oData = oMockModel.getProperty("/Traslado");

          if (oData.Accion === undefined) {
            let oPath = oModel.createKey("/TrasladoSet", {
              Ot: "",
              Posicion: "",
              Pallet: oValue,
              Accion: "P",
            });

            let rta = await this._onreadModelTraslado(oModel, oView, oPath);
            console.log(rta);
            this.onShowMessagesTraslado(rta);

            if (rta.Respuesta === "OK") {
              if (rta.Datos.TipoMensaje === "S") {
                rta.Datos.Accion = "P";
                oMockModel.setProperty("/Traslado", rta.Datos);
                oDataScan.Origen = rta.Datos.Origen;
                this._onValidaComportamiento(oMockModel, rta.Datos, oDataScan);
              } else {
                this.onShowMessagesTraslado(rta.Datos, oEvent);
              }
            } else {
              this._onErrorHandle(rta.Datos);
            }
          } else {
            if (oData.Pallet !== oValue) {
              this._onShowMsg3();
            } else {
              this._onFocusControl(this.byId("idTraDestino"));
            }
          }
        },

        // Ingreso por Buscar *************************************
        onBuscarOt: async function () {
          let oModel = this.getOwnerComponent().getModel(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oView = this.getView();

          let oPath = oModel.createKey("/TrasladoSet", {
            Ot: "",
            Posicion: "",
            Pallet: "",
            Accion: "B",
          });

          let rta = await this._onreadModelTraslado(oModel, oView, oPath);

          if (rta.Respuesta === "OK") {
            rta.Datos.Accion = "B";
            oMockModel.setProperty("/Traslado", rta.Datos);
            this._onValidaComportamiento(oMockModel, rta.Datos, []);
          } else {
            this._onErrorHandle(rta.Datos);
          }
        },

        // Ingreso por TrasladoSinEtiqueta  *************************************

        onMaterialScan: async function (oEvent) {
          // va read MaterialesSet con lo que vino en el servicio + el scaneo

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oValue = oEvent.getSource().getValue(),
            oData = oMockModel.getProperty("/Traslado"),
            oDataScan = oMockModel.getProperty("/TrasladoScan"),
            oMaterial = oData.Material;

          let oPath = oModel.createKey("/MaterialSet", {
            MaterialScan: oMaterial,
            Ean11: oValue,
          });

          let rta = await this._onreadModelTraslado(oModel, oView, oPath);

          if (rta.Respuesta === "OK") {
            if (rta.Datos.TipoMensaje !== "E") {
              oData.Ean11 = rta.Datos.Ean11;
              oDataScan.Cantidad = parseInt(oDataScan.Cantidad) + 1;
              oDataScan.Cantidad = oDataScan.Cantidad.toString();
              oMockModel.setProperty("/TrasladoScan", oDataScan);
              oMockModel.setProperty("/Traslado", oData);
            } else {
              this.onShowMessagesTraslado(rta.Datos);
            }
          } else {
            this._onErrorHandle(rta.Datos);
          }

          if (oDataScan.Cantidad === oData.Cantidad) {
            this._onFocusControl(this.byId("idTraDestino"));
          } else {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          }
        },

        onCantidadScan: function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oValue = oEvent.getSource().getValue(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/Traslado"),
            oDataScan = oMockModel.getProperty("/TrasladoScan"),
            oCantidad = oData.Cantidad;

          if (oValue !== oCantidad) {
            this._onShowMsg8(oEvent);
          } else {
            if (
              oDataScan.Ean11 !== undefined &&
              oDataScan.Ean11 !== "" &&
              oDataScan.Ean11 === oData.Ean11
            ) {
              oMockModel.setProperty("/TrasladoMaterialValidado", false);
              this._onFocusControl(this.byId("idTraDestino"));
            } else {
              this._onFocusControl(this.byId("idTraPalletMaterial"));
              oMockModel.setProperty("/TrasladoMaterialValidado", true);
            }
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
            oData = oMockModel.getProperty("/Traslado"),
            oDataScan = oMockModel.getProperty("/TrasladoScan"),
            oMaterial = oData.Material;

          let oPath = oModel.createKey("/DestinoValidacionSet", {
            Ot: oData.Ot,
            Posicion: oData.Posicion,
            Pallet: oData.Pallet,
            Accion: oData.Accion,
            Destino: oValue,
            Caso: oData.Caso,
          });

          let rta = await this._onreadModelTraslado(oModel, oView, oPath);

          if (rta.Respuesta === "OK") {
            if (rta.Datos.TipoMensaje === "S") {
              this.onValidarMovimiento();
            } else {
              this.onShowMessagesTraslado(rta.Datos, oEvent);
            }
          } else {
            this._onErrorHandle(rta.Datos);
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

        _onValidaComportamiento: function (oMockModel, oData, oDataScan) {
          switch (oData.Accion) {
            case "P":
              if (oData.Caso === "01" || oData.Caso === "03") {
                oMockModel.setProperty("/TrasladoScan", oDataScan);

                this._onFocusControl(this.byId("idTraDestino"));
              } else {
                this._onFocusControl(this.byId("idTraOrigen"));
              }
              break;
            case "S":
              this._onFocusControl(this.byId("idTraPalletMaterial"));

              break;
            case "B":
              this._onFocusControl(this.byId("idMovPalletInput"));

              break;
            default:


              break;
          }
          if (oData.Caso === "01" && oData.Confirmado.toUpperCase() !=="X"){
            oDataScan.Destino = oData.DestinoEntrada;
            oMockModel.setProperty("/TrasladoScan", oDataScan);
            this.onValidTraslado();
          }

        },

        onValidTraslado: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Traslado"),
            oScan = oMockModel.getProperty("/TrasladoScan"),
            oPallet = this.onQuitaZeros(oData.Pallet),
            oOrigen = this.onQuitaZeros(oData.Origen),
            oDestino = oData.Destino,
            oPalletScan = this.onQuitaZeros(oScan.Pallet),
            oOrigenScan = this.onQuitaZeros(oScan.Origen),
            oDestinoScan = oScan.Destino;

          if (oPallet === oPalletScan && oOrigen === oOrigenScan) {
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
            oEntity = "/TrasladoSet",
            oPayload = oMockModel.getProperty("/Traslado");
          let rta = await this._oncreateModel(oModel, oView, oEntity, oPayload);

          if (rta.Respuesta === "OK") {
            if (rta.Datos.TipoMensaje === "S") {
              this.onShowMessagesTraslado(rta.Datos, oEvent);
            } else {
              this._onErrorHandle(rta.Datos);
            }
          } else {
            this._onErrorHandle(rta.Datos);
          }
        },

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
              this._onShowMsg5();
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
            case "09":
              this._onShowMsg9();
              break;
            case "10":
              this._onShowMsg10();
              break;
            case "11":
              this._onShowMsg11();
              break;
            case "12":
              this._onShowMsg12();
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
            if (rta === this._i18n().getText("btnvolver")) {
              this.onClearScreen();
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
            if (rta === this._i18n().getText("btnrepetir")) {
            } else {
              this.onClearScreen();
            }
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
