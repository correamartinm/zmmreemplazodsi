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
          oTarget.attachDisplay(this.onClearScreen, this);
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

          rta = await this._onreadModel(oModel, oView, oPath);

          if (rta.Datos.Material) {
            oMockModel.setProperty("/Devolucion", rta.Datos);
            // oMockModel.setProperty("/DevolucionScan", rta);
            oMockModel.setProperty("/EtiquIngxPalletsBTN", true);
          } else {
            this._onFocusControl(this.getView().byId("idAlmPalletScan"));
          }
        },

        onClearScreen: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          oMockModel.setProperty("/Almacenamiento", {
            Pallet: "",
            Destino: "",
          });
          oMockModel.setProperty("/Devolucion", {});
          oMockModel.setProperty("/AlmacenamientoScan", {});
          oMockModel.setProperty("/DevolucionScan", {
            Material: "",
            Cantidad: 0,
            Destino: "",
          });
          oMockModel.setProperty("/EtiquIngxPallets", false);

          oMockModel.setProperty("/AlmValidAlmacenamiento", false);
          oMockModel.setProperty("/AlmValidDevolucion", false);

          this._onObjectMatched();
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
          console.log(rta);
          if (rta.Respuesta === "OK") {
            if (rta.Datos.TipoMensaje !== "E") {
              oMockModel.setProperty("/Almacenamiento", rta.Datos);
              if (rta.Datos.Tipo === "03") {
                if (rta.Datos.Pvqui === "X" && rta.Datos.Caso === "02") {
                  this.onLlevarRemanejo();
                  return;
                }

                if (rta.Datos.Pvqui !== "X" && rta.Datos.Caso === "03") {
                  this.onLlevarDestino();
                  return;
                }

                if (rta.Datos.Pvqui === "X" && rta.Datos.Caso === "01") {
                  this.onLlevarDestino();
                  return;
                }
              }

              this.onShowMensajes(rta.Datos, oEvent);
            } else {
              this.onShowMensajes(rta.Datos, oEvent);
            }
          } else {
            this._onErrorHandle(rta.Datos);
          }
        },

        onShowMensajes: function (rta, oEvent) {
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

            case "04":
              this._onShowMsg4(oEvent);
              break;

            case "05":
              this._onShowMsg5(oEvent);
              break;
            case "06":
              this._onShowMsg6(oEvent);
              break;
            case "07":
              this._onShowMsg7(oEvent);
              break;

            case "":
              this.onLlevarDestino(oEvent);

              break;

            default:
              break;
          }
        },

        onInputDestinoSubmit: async function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;

          let oValue = oEvent.getSource().getValue(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Almacenamiento"),
            oDestino = oData.DestinoEntrada;

          if (this.onFormatCodigo(oValue) !== oDestino) {
            // if (oValue !== oDestino) {
            this._onShowMsg4(oEvent);
          } else {
            this.onValidAlmacenamiento();
          }
        },

        // Ingreso por Devolucion  *************************************

        onMaterialScan: function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oValue = oEvent.getSource().getValue(),
            oData = oMockModel.getProperty("/Devolucion"),
            oDataScan = oMockModel.getProperty("/DevolucionScan");

          if (oValue !== oData.Ean11) {
            this._onShowMsg6(oEvent);
          } else {
            if (oDataScan.Cantidad > 0) {
              oDataScan.Cantidad = parseFloat(oDataScan.Cantidad) + 1;
              oMockModel.setProperty("/DevolucionScan", oDataScan);

              if (
                parseFloat(oData.Cantidad) === parseFloat(oDataScan.Cantidad)
              ) {
                this._onFocusControl(
                  this.getView().byId("idAlmDevDestinoScan")
                );
              } else {
                this._onFocusControl(oEvent.getSource());
                oEvent.getSource().setValue("");
              }

            } else {
              let objectMsg = {
                titulo: this._i18n().getText("lblalmacenamiento"),
                mensaje: this._i18n().getText("msgingreso"),
                icono: sap.m.MessageBox.Icon.QUESTION,
                acciones: [
                  this._i18n().getText("btnsumar"),
                  this._i18n().getText("btntotal"),
                ],
                resaltar: this._i18n().getText("btnsumar"),
              };

              this._onShowMsgBox(objectMsg).then((rta) => {
                if (rta === this._i18n().getText("btntotal")) {
                  oDataScan.Cantidad = parseFloat(oData.Cantidad);
                } else {
                  oDataScan.Cantidad = parseFloat(oDataScan.Cantidad) + 1;
                }
                oMockModel.setProperty("/DevolucionScan", oDataScan);
                if (
                  parseFloat(oData.Cantidad) === parseFloat(oDataScan.Cantidad)
                ) {
                  this._onFocusControl(
                    this.getView().byId("idAlmDevDestinoScan")
                  );
                } else {
                  this._onFocusControl(oEvent.getSource());
                  oEvent.getSource().setValue("");
                }
              });
            }
          }
        },

        onCantidadScan: function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oValue = oEvent.getSource().getValue(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/Devolucion"),
            oCantidad = oData.Cantidad;

          if (parseFloat(oValue) > parseFloat(oCantidad)) {
            this._onShowMsg7(oEvent);
          } else {
            if (parseFloat(oValue) === parseFloat(oCantidad)) {
              this._onFocusControl(this.getView().byId("idAlmDevDestinoScan"));
              oDataScan.Cantidad = parseFloat(oDataScan.Cantidad) + 1;
              oMockModel.setProperty("/DevolucionScan", oDataScan);
            } else {
              this._onFocusControl(oEvent.getSource());
              oEvent.getSource().setValue("");
            }
          }
        },

        onDestinoScanDEV: function (oEvent) {
          if (oEvent.getSource().getValue().length < 1) return;
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oValue = oEvent.getSource().getValue(),
            oView = this.getView(),
            oData = oMockModel.getProperty("/Devolucion"),
            oDestino = oData.DestinoEntrada;

          if (this.onFormatCodigo(oValue) !== oDestino) {
            this._onShowMsg4(oEvent);
          } else {
            this.onValidDevolucion();
          }
        },

        // Validaciones *****************************

        onValidAlmacenamiento: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Almacenamiento"),
            oScan = oMockModel.getProperty("/AlmacenamientoScan"),
            oPallet = oData.Pallet,
            oPalletScan = this.onQuitaZeros(oScan.Pallet),
            oDestino,
            oDestinoScan;

          if (
            oScan.Destino !== undefined &&
            oData.Destino !== "Zona intermedia"
          ) {
            oDestino = oData.DestinoEntrada;
            oDestinoScan = this.onFormatCodigo(oScan.Destino);
            oDestinoScan = oDestinoScan.trim();
          } else {
            oDestino = oData.Destino;
            oDestinoScan = oScan.Destino;
          }

          if (
            oPallet.trim() === oPalletScan.trim() &&
            oDestino.trim() === oDestinoScan
          ) {
            oMockModel.setProperty("/AlmValidAlmacenamiento", true);
          } else {
            oMockModel.setProperty("/AlmValidAlmacenamiento", false);
          }
        },

        onValidDevolucion: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Devolucion"),
            oScan = oMockModel.getProperty("/DevolucionScan"),
            oMaterial = oData.Ean11,
            oCantidad = oData.Cantidad,
            oDestino = oData.Destino,
            oMaterialScan = oScan.Material,
            oCantidadScan = oScan.Cantidad,
            oDestinoScan = oScan.Destino;

          if (oMaterial === oMaterialScan && oCantidad === oCantidadScan) {
            oMockModel.setProperty("/AlmValidDevolucion", true);
          } else {
            oMockModel.setProperty("/AlmValidDevolucion", false);
          }
        },

        onConfirmaAlmacenamiento: async function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oEntity = "/AlmacenamientoSet",
            oAlmacenamientoRta = oMockModel.getProperty("/Almacenamiento");
          let oPayload = {
            Pallet: oAlmacenamientoRta.Pallet.trim(),
            Caso: oAlmacenamientoRta.Caso,
            Almacen: oAlmacenamientoRta.Almacen,
            Ot: oAlmacenamientoRta.Ot,
            Posicion: oAlmacenamientoRta.Posicion,
            Etapa: oAlmacenamientoRta.Etapa,
            Tipo: oAlmacenamientoRta.Tipo,
          };

          let rta = await this._oncreateModel(oModel, oView, oEntity, oPayload);

          if (rta.Respuesta === "OK") {
            if (rta.Datos.TipoMensaje !== "E") {
              this._onShowMsg5();
            } else {
              this._onErrorHandle(rta.Datos);
            }
          } else {
            this._onErrorHandle(rta.Datos);
          }
        },

        onConfirmaDevolucion: async function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oEntity = "/AlmacenamientoSet",
            oAlmacenamientoRta = oMockModel.getProperty("/Devolucion");

          let oPayload = {
            Pallet: oAlmacenamientoRta.Pallet.trim(),
            Caso: oAlmacenamientoRta.Caso,
            Almacen: oAlmacenamientoRta.Almacen,
            Ot: oAlmacenamientoRta.Ot,
            Posicion: oAlmacenamientoRta.Posicion,
            Etapa: oAlmacenamientoRta.Etapa,
            Tipo: oAlmacenamientoRta.Tipo,
          };

          let rta = await this._oncreateModel(oModel, oView, oEntity, oPayload);

          if (rta.Respuesta === "OK") {
            if (rta.Datos.TipoMensaje !== "E") {
              this._onShowMsg5();
            } else {
              this._onErrorHandle(rta.Datos);
            }
          } else {
            this._onErrorHandle(rta.Datos);
          }
        },

        onLlevarRemanejo: async function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oModel = this.getOwnerComponent().getModel(),
            oView = this.getView(),
            oEntity = "/RemanejoSet",
            oPayload = oMockModel.getProperty("/Almacenamiento"),
            oPayloadScan = oMockModel.getProperty("/AlmacenamientoScan");

          let oPath = oModel.createKey("/RemanejoSet", {
            Pallet: oPayload.Pallet,
          });

          let rta = await this._onreadModel(oModel, oView, oPath, oEvent);

          if (rta.Respuesta === "OK") {
            if (rta.Datos.TipoMensaje !== "E") {
              if (rta.Datos.Caso === "62") {
                if (rta.Datos.Destino !== "Zona intermedia") {
                  // rta.Datos.DestinoEntrada = "RMNJ1";
                  rta.Datos.Destino = "005RMNJ1";
                } else {
                  oPayloadScan.Destino = rta.Datos.Destino;
                }

                oMockModel.setProperty("/AlmacenamientoScan", oPayloadScan);
              }

              if (rta.Datos.Caso === "61") {
                rta.Datos.DestinoEntrada = "RMNJ1";
                rta.Datos.Destino = "005RMNJ1";
              }

              // Zona intermedia :
              oMockModel.setProperty("/Almacenamiento", rta.Datos);
              this.onValidAlmacenamiento();
            } else {
              this._onErrorHandle(rta.Datos);
            }
          } else {
            this._onErrorHandle(rta.Datos);
          }

          // this._onErrorHandle({Mensaje: "Remanejo Pendiente de Implementación"});
          // this._onFocusControl(this.getView().byId("idAlmDestinoScan"));
        },

        onLlevarDestino: async function (oEvent) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oData = oMockModel.getProperty("/Almacenamiento");
          oData.Pallet = oData.Pallet.trim();
          if (oData.Destino === "Zona intermedia") {
            oMockModel.setProperty("/AlmacenamientoScan", oData);
            this.onValidAlmacenamiento();
          } else {
            this._onFocusControl(this.getView().byId("idAlmDestinoScan"));
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
            this.onClearScreen();
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
            this.onClearScreen();
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
            switch (rta) {
              case this._i18n().getText("btnvolver"):
                this.onClearScreen();
                break;

              case this._i18n().getText("btnllevardestino"):
                this.onLlevarDestino();
                //  this._onFocusControl(oEvent.getSource());
                break;

              case this._i18n().getText("btnllevarremanejo"):
                this.onLlevarRemanejo();
                break;

              default:
                break;
            }
          });
        },

        _onShowMsg4: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgubcincompatible"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            this.onClearScreen();
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
            this.onClearScreen();
          });
        },
        _onShowMsg6: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgmaterialnoesperado"),
            icono: sap.m.MessageBox.Icon.WARNING,
            acciones: [this._i18n().getText("btnvolver")],
            resaltar: this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          });
        },
        _onShowMsg7: function (oEvent) {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgcantidadnoesperada"),
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
