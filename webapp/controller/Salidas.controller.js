sap.ui.define(
  ["./BaseController", "sap/ui/core/ValueState"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} BaseController
   * @param {typeof sap.ui.core.ValueState} ValueState
   */
  function (BaseController, ValueState) {
    "use strict";
    let oArrayOt = [];
    return BaseController.extend("morixe.zmmreemplazodsi.controller.Salidas", {
      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        let oTarget = oRouter.getTarget("TargetOtSaliente");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },

      _onObjectMatched: async function (evt) {
        this.onClearScreen();
      },

      onPalletRead: async function () {
        
        this._onFocusControl(this.byId("idSalPalletScan"));

        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oValue = oMockModel.getProperty("/SalidaxPallet");
        oMockModel.setProperty("/SalidaxPallet", !oValue);
        oMockModel.setProperty("/SalidaScan", {});
        oMockModel.setProperty("/Salida", {});
        if (!oValue == true) {
          this._onFocusControl(this.byId("idSalPalletScanV2"));
        } else {
          this.onClearScreen();
        }
      },

      onClearScreen: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/Salida", {
          Pallet: "",
          Destino: "",
        });
        // oArrayOt = [];
        oMockModel.setProperty("/SalidaScan", {});
        oMockModel.setProperty("/SalidaValida", false);
        oMockModel.setProperty("/SalidaxPallet", false);

        this._onFocusControl(this.byId("idOtOutInput"));
      },

      onBuscar: async function () {
        this.onClearScreen();
        let oModel = this.getOwnerComponent().getModel(),
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oDataScan = oMockModel.getProperty("/SalidaScan"),
          oView = this.getView();

        let oPath = oModel.createKey("/SalidaSet", {
          Ot: "",
          Posicion: "",
          Pallet: "",
          Accion: "B",
        });

        let rta = await this._onreadModelTraslado(oModel, oView, oPath);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            rta.Accion = "B";

            if (rta.Datos.Caso === "11" || rta.Datos.Caso === "31") {
              oDataScan.Destino = rta.Datos.Destino;
              oMockModel.setProperty("/SalidaScan", oDataScan);
            }

            oMockModel.setProperty("/Salida", rta.Datos);
            this._onFocusControl(this.byId("idSdaOrigen"));
          } else {
            this._onErrorHandle(rta.Datos);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      onLeerPallet: async function (oEvent) {
        let oValue = oEvent.getSource().getValue(),
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),

         oDataScan = oMockModel.getProperty("/SalidaScan");

        let oPath = oModel.createKey("/SalidaSet", {
          Ot: "",
          Posicion: "",
          Pallet: oValue,
          Accion: "P",
        });

        let rta = await this._onreadModelTraslado(oModel, oView, oPath);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            rta.Accion = "P";
            rta.Datos.OrigenValidacion = rta.Datos.Origen;
            oDataScan.Ot = rta.Datos.Ot;
            oDataScan.Origen = rta.Datos.Origen;
            oMockModel.setProperty("/Salida", rta.Datos);
            oMockModel.setProperty("/SalidaScan", oDataScan);
            this._onFocusControl(this.byId("idSalDestinoScan"));

          } else {
            this.onShowMessagesSalida(rta.Datos, oEvent);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      onInputOtScanSubmit: async function (oEvent) {
        let oValue = oEvent.getSource().getValue(),
          oModel = this.getOwnerComponent().getModel(),
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oView = this.getView();

        let oPath = oModel.createKey("/SalidaSet", {
          Ot: oValue,
          Posicion: "",
          Pallet: "",
          Accion: "O",
        });

        let rta = await this._onreadModelTraslado(oModel, oView, oPath);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            oMockModel.setProperty("/Salida", rta.Datos);
            this._onFocusControl(this.byId("idSdaOrigen"));
          } else {
            this.onShowMessagesSalida(rta.Datos, oEvent);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      onInputScanOrigenSubmit: async function (oEvent) {
        if (oEvent.getSource().getValue().length < 1) return;

        let oValue = oEvent.getSource().getValue(),
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oData = oMockModel.getProperty("/Salida");

        if (this.onFormatCodigo(oValue) !== oData.OrigenValidacion) {
          this._onShowMsg1(oEvent);
        } else {
          this._onFocusControl(this.byId("idSalPalletScan"));
        }
      },

      onInputScanPalletSubmit: async function (oEvent) {
        let oValue = oEvent.getSource().getValue();

        if (oValue.length < 1) return;

        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          oData = oMockModel.getProperty("/Salida"),
          oView = this.getView();

        //Busca Info por Pallet
        let oPath = oModel.createKey("/PalletValidacionSet", {
          Material: oData.Material,
          Pallet: oValue,
          Entrega: oData.Entrega,
          Almacen: oData.Almacen,
          Ot: oData.Ot,
          Posicion: oData.Posicion
        });

        let rta = await this._onreadModel(oModel, oView, oPath);
        console.log(rta);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            if (oData.Caso !== "11" && oData.Caso !== "31") {
              this._onFocusControl(this.byId("idSalDestinoScan"));
            } else {
              oData.Pallet = rta.Datos.Pallet;
              oMockModel.setProperty("/SalidaValida", true);
              oMockModel.setProperty("/Salida", oData);
            }
          } else {
            this.onShowMessagesSalida(rta.Datos, oEvent);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      idSalDestinoScanSubmit: async function (oEvent) {
        if (oEvent.getSource().getValue().length < 1) return;

        let oValue = this.onFormatCodigo(oEvent.getSource().getValue()),
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oData = oMockModel.getProperty("/Salida");

        if (oValue !== oData.DestinoValidacion) {
          this._onShowMsg10(oEvent);
        } else {
          this._onValidaSalida();
        }
      },

      _onValidaSalida: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oData = oMockModel.getProperty("/Salida"),
          oScan = oMockModel.getProperty("/SalidaScan"),
          oPallet = oData.Pallet,
          oOrigen = oData.OrigenValidacion,
          oDestino = oData.DestinoValidacion,
          oPalletScan = oScan.Pallet,
          oOrigenScan = oScan.Origen,
          oDestinoScan = oScan.Destino;

        oMockModel.setProperty("/SalidaValida", false);

        if (this.onQuitaZeros(oPallet) !== this.onQuitaZeros(oPalletScan))
          return;
        if (this.onQuitaZeros(oOrigen) !== this.onQuitaZeros(oOrigenScan))
          return;
        if (oData.Caso !== "11" && oData.Caso !== "31") {
          if (this.onQuitaZeros(oDestino) !== this.onFormatCodigo(oDestinoScan))
            return;
        }

        oMockModel.setProperty("/SalidaValida", true);
      },

      onSalidaContinuar: async function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),
          oEntity = "/SalidaSet",
          oPayload = oMockModel.getProperty("/Salida");
        let rta = await this._oncreateModel(oModel, oView, oEntity, oPayload);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            // oMockModel.setProperty("/Salida", rta);

            this.onShowMessagesSalida(rta.Datos, []);
          } else {
            this._onErrorHandle(rta.Datos);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      onShowMessagesSalida: function (rta, oEvent) {
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

          default:
            break;
        }
      },

      _onShowMsg1: function (oEvent) {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msguborigen"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {

          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue();
            this._onFocusControl(oEvent.getSource());
          }
        });
      },

      _onShowMsg2: function (oEvent) {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgcodigo"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnconfirm"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue();
            this._onFocusControl(oEvent.getSource());
          }
        });
      },

      _onShowMsg3: function (oEvent) {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgcodpalletmaterial"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue();
            this._onFocusControl(oEvent.getSource());
          }
        });
      },

      _onShowMsg4: function (oEvent) {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgposicionot"),
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

      _onShowMsg5: function (oEvent) {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgmenomat"),
          icono: sap.m.MessageBox.Icon.QUESTION,
          acciones: [
            this._i18n().getText("btnvolver"),
            this._i18n().getText("btnconfirm"),
          ],
          resaltar: this._i18n().getText("btnconfirm"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue();
            this._onFocusControl(oEvent.getSource());
          }
        });
      },
      _onShowMsg6: function () {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgmono"),
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
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgmovok"),
          icono: sap.m.MessageBox.Icon.SUCCESS,
          acciones: [
            this._i18n().getText("btnvolver"),
            this._i18n().getText("btnsiguientepos"),
          ],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          this.onClearScreen();
        });
      },

      _onShowMsg8: function () {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgotconfirmada"),
          icono: sap.m.MessageBox.Icon.SUCCESS,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          this.onClearScreen();
        });
      },
      _onShowMsg9: function () {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgrepetir"),
          icono: sap.m.MessageBox.Icon.QUESTION,
          acciones: [
            this._i18n().getText("btnvolver"),
            this._i18n().getText("btnrepetir"),
          ],
          resaltar: this._i18n().getText("btnconfirm"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          // if (rta === this._i18n().getText("btnvolver")) {
          // }
        });
      },

      _onShowMsg10: function (oEvent) {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgcanal"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue();
            this._onFocusControl(oEvent.getSource());
          }
        });
      },
    });
  }
);
