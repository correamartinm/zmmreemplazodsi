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
        let oModel = this.getOwnerComponent().getModel(),
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
            oMockModel.setProperty("/Salida", rta);
          } else {
            this._onErrorHandle(rta.Datos);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      onLeerPallet: async function (oEvent) {
        let oValue = oEvent.getSource().getValue();

        let oModel = this.getOwnerComponent().getModel(),
          oView = this.getView();

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
            oMockModel.setProperty("/Salida", rta);
          } else {
            this.onShowMessagesSalida(rta.Datos, oEvent);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      onInputOtScanSubmit: async function (oEvent) {
        let oValue = oEvent.getSource().getValue();
        let oModel = this.getOwnerComponent().getModel(),
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
            oMockModel.setProperty("/Salida", rta);
            this._onFocusControl(this.byId("idTraPalletMaterial"));
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

        if (oValue !== oData.OrigenValidacion) {
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
        });

        let rta = await this._onreadModel(oModel, oView, oPath);
        console.log(rta);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            // oMockModel.setProperty("/Salida", rta);

            this._onFocusControl(this.byId("idSalDestinoScan"));
          } else {
            this.onShowMessagesSalida(rta.Datos, oEvent);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      idSalDestinoScanSubmit: async function (oEvent) {
        if (oEvent.getSource().getValue().length < 1) return;

        let oValue = oEvent.getSource().getValue(),
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oData = oMockModel.getProperty("/Salida");

        if (oValue !== oData.DestinoValidacion) {
          this._onShowMsg4(oEvent);
        } else {
          this.onValidarMovimiento();
        }
      },

      onValidaSalida: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oData = oMockModel.getProperty("/Salida"),
          oScan = oMockModel.getProperty("/SalidaScan"),
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
          oMockModel.setProperty("/SalidaValida", true);
        } else {
          oMockModel.setProperty("/SalidaValida", false);
        }
      },

      onSalidaContinuar: async function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),
          oEntity = "/AlmacenamientoSet",
          oPayload = oMockModel.getProperty("/Salida");
        let rta = await this._oncreateModel(oModel, oView, oEntity, oPayload);
        if (rta !== undefined) this.onShowMessagesTraslado(rta);
      },

      onShowMessagesSalida: function (rta, oEvent) {
        switch (rta.Tipo) {
          case "01":
            this._onShowMsg1();
            break;
          case "02":
            this._onShowMsg2(oEvent);
            break;
          case "03":
            this._onShowMsg3(oEvent);
            break;
          case "05":
            this._onShowMsg5();
            break;
          case "06":
            this._onShowMsg6(oEvent);
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
          titulo: this._i18n().getText("btnsalidaventas"),
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
            oEvent.getSource()().setValue();
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
            oEvent.getSource()().setValue();
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
            oEvent.getSource()().setValue();
          }
        });
      },
      _onShowMsg6: function (oEvent) {
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
          // if (rta === this._i18n().getText("btnvolver")) {
          // }
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
          // if (rta === this._i18n().getText("btnvolver")) {
          // }
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
    });
  }
);
