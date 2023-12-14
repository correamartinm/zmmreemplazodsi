sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/ValueState",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
  ],

  /**
   * @param {typeof sap.ui.core.mvc.BaseController} BaseController
   * @param {typeof sap.ui.core.ValueState} ValueState
   */
  function (BaseController, ValueState, FilterOperator, Filter) {
    "use strict";

    return BaseController.extend("morixe.zmmreemplazodsi.controller.Remanejo", {
      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        let oTarget = oRouter.getTarget("TargetRemanejo");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },

      _onObjectMatched: function (evt) {
        this._onFocusControl(this.byId("idMovPalletInput"));
        this._onResetData();
      },

      _onResetData: function () {
        this._onClearTable();
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/MaterialesAdded", []);
        oMockModel.setProperty("/Materiales", []);
        oMockModel.setProperty("/MaterialesAddedCount", "");
        oMockModel.setProperty("/RemanejoScan", { Ean11: "", Material: "" });
        oMockModel.setProperty("/Remanejo", 1);
      },

      _onClearTable: function () {
        let oTable = this.getView().byId("idMaterialStock"),
          oItems = oTable.getItems();

        if (oItems.length > 0) {
          for (var index = 0; index < oItems.length; index++) {
            oItems[index].getCells()[2].setEnabled(false);
            oItems[index].getCells()[2].setValue();
          }
        }
        oTable.removeSelections();
      },

      onMaterialRemanejoScan: async function (oEvent) {
        // va read MaterialesSet con lo que vino en el servicio + el scaneo

        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),
          oEntidad = "/RemanejoPalletSet",
          oValue = oEvent.getSource().getValue(),
          oFilter = [];
        oFilter.push(new Filter("Ean11", FilterOperator.EQ, oValue));

        let rta = await this._onfilterModel(oModel, oView, oEntidad, oFilter);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            oMockModel.setProperty("/Materiales", rta.Datos.results);
            let DataScan = {
              Ean11: oValue,
              Material: rta.Datos.results[0].Material,
            };
            oMockModel.setProperty("/RemanejoScan", DataScan);
          } else {
            this.onShowMessagesRemanejo(rta.Datos, oEvent);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }

        // this._onFocusControl(oEvent.getSource());
      },

      onAgregarButtonPress: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        this._onResetData();
        oMockModel.setProperty("/Remanejo", 3);
      },
      onAgregarSeleccionButtonPress: async function () {
        let oTable = this.getView().byId("idMaterialStock"),
          oMockModel = this.getView().getModel("mockdata"),
          oModel = this.getView().getModel(),
          oView = this.getView(),
          oItems = oTable.getSelectedItems(),
          oPath,
          oSelectedData = [],
          vObject;
        for (var index = 0; index < oItems.length; index++) {
          let oPayload = {};
          oPath = oItems[index].getBindingContextPath();
          vObject = oMockModel.getObject(oPath);
          vObject.Ingreso = oItems[index].getCells()[2].getValue();

          oPayload.Descripcion = vObject.Descripcion;
          oPayload.Disponible = vObject.Disponible;
          oPayload.Ean11 = vObject.Ean11;
          oPayload.Ingreso = oItems[index].getCells()[2].getValue();
          oPayload.Lote = this.onQuitaZeros(vObject.Lote);
          oPayload.Material = this.onQuitaZeros(vObject.Material);
          oPayload.Mensaje = vObject.Mensaje;
          oPayload.Tipo = vObject.Tipo;
          oPayload.TipoMensaje = vObject.TipoMensaje;

          let oPathUPD = oModel.createKey("/RemanejoPalletSet", {
            Ean11: vObject.Ean11,
            Material: vObject.Material,
            Lote: vObject.Lote,
          });

          oSelectedData.push(oPayload);

          // let rta = await this._onupdateModel(
          //   oModel,
          //   oView,
          //   oPathUPD,
          //   oPayload
          // );

          // if (rta.Respuesta === "OK") {
          //   if (rta.Datos.TipoMensaje !== "E") {
          //     oMockModel.setProperty("/MaterialesAdded", oSelectedData);
          //     oMockModel.setProperty(
          //       "/MaterialesAddedCount",
          //       oSelectedData.length
          //     );
          //   } else {
          //     console.log("Error:" + rta.Datos);
          //   }
          // }
        }
        // cambio pantalla

        oMockModel.setProperty("/MaterialesAdded", oSelectedData);
        oMockModel.setProperty("/Remanejo", 1);
      },
      onTableMaterialesSelectionChange: function (oEvent) {
        let oTable = this.getView().byId("idMaterialStock"),
          oMockModel = this.getView().getModel("mockdata"),
          oItems = oTable.getItems(),
          oPath,
          vObject;

        for (var index = 0; index < oItems.length; index++) {
          oItems[index].getCells()[2].setEnabled(oItems[index].getSelected());
          oPath = oItems[index].getBindingContextPath();
          vObject = oMockModel.getObject(oPath);

          if (oItems[index].getSelected() === false) {
            oItems[index].getCells()[2].setValue();
            oItems[index]
              .getCells()[2]
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            oItems[index].getCells()[2].setEnabled(oItems[index].getSelected());

            if (
              oItems[index].getCells()[2].getValue() === "0.00" ||
              oItems[index].getCells()[2].getValue() === ""
            ) {
              if (parseFloat(vObject.Disponible) > 0) {
                // oItems[index].getCells()[2].setValue(vObject.Disponible);
              }
              vObject.Ingreso = oItems[index].getCells()[2].getValue();
            }

            oItems[index]
              .getCells()[2]
              .setValueState(sap.ui.core.ValueState.None);

            this._onFocusControl(oItems[index].getCells()[2]);
          }
        }
      },

      _onCheckTable: function () {
        let oTable = this.getView().byId("idMaterialStock"),
          oMockModel = this.getView().getModel("mockdata"),
          oValue,
          oMax,
          oItems = oTable.getSelectedItems();

        if (oItems.length > 0) {
          for (var index = 0; index < oItems.length; index++) {
            oValue = parseFloat(oItems[index].getCells()[2].getValue());
            oMax = parseFloat(oItems[index].getCells()[1].getText());

            if (oValue > 0 && oValue <= oMax) {
              oMockModel.setProperty("/MaterialesAddedCount", "1");
            } else {
              oMockModel.setProperty("/MaterialesAddedCount", "");
              break;
            }
          }
        } else {
          oMockModel.setProperty("/MaterialesAddedCount", "");
        }
      },

      onCheckCantidad: function (oEvent) {
        let oTarget = oEvent.getSource(),
          oStockTable = this.getView().byId("idMaterialStock"),
          oMax = oEvent.getSource().getParent().getCells()[1].getText(),
          oValue = oTarget.getValue();
        let oItem = oStockTable.getSelectedItem();

        oValue = parseFloat(oValue);
        oMax = parseFloat(oMax);

        if (oValue === 0 || isNaN(oValue)) return;

        if (oValue <= oMax) {
          oTarget.setValueState(ValueState.None);
          //
        } else {
          this._onShowMsg2(oEvent);
          // oTarget.setValueState(ValueState.Warning);
        }

        this._onCheckTable();
      },

      onCancelarSeleccionButtonPress: function () {
        this._onResetData();
      },

      onPostRemanejo: async function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),
          oEntity = "/RemanejoPalletSet",
          oPayload = oMockModel.getProperty("/RemanejoScan");

        let rta = await this._oncreateModel(oModel, oView, oEntity, oPayload);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            this.onShowMessagesRemanejo(rta.Datos, []);
            oMockModel.setProperty("/ImpresionData", rta.Datos );
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      onPostImpresion: async function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),
          oEntity = "/EtiquetaSet",
          oPayload = oMockModel.getProperty("/ImpresionData");

        let rta = await this._oncreateModel(oModel, oView, oEntity, oPayload);

        if (rta.Respuesta === "OK") {
          if (rta.Datos.TipoMensaje !== "E") {
            this.onShowMessagesRemanejo(rta.Datos, []);
          }
        } else {
          this._onErrorHandle(rta.Datos);
        }
      },

      // Mensajes ***************************
      onShowMessagesRemanejo: function (rta, oEvent) {
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

      _onShowMsg2: function (oEvent) {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgtrascantidad"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          }
        });
      },

      _onShowMsg3: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgcodigonomaterial"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [
            this._i18n().getText("btnvolver"),
            this._i18n().getText("btnmover"),
          ],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          }
        });
      },

      _onShowMsg4: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgexiste"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [
            this._i18n().getText("btnvolver"),
            this._i18n().getText("btnmover"),
          ],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          }
        });
      },

      _onShowMsg5: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgtrascantidad"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          }
        });
      },
      _onShowMsg6: function (oEvent, oValue) {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgnuevonum") + " " + oValue,
          icono: sap.m.MessageBox.Icon.SUCCESS,
          acciones: [this._i18n().getText("btnimprimir")],
          resaltar: this._i18n().getText("btnimprimir"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnimprimir")) {
            // this.onPrintEtiqueta();
          }
        });
      },

      _onShowMsg7: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgexiste"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [
            this._i18n().getText("btnvolver"),
            this._i18n().getText("btnmover"),
          ],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnmover")) {
            // Mover a nueva Ubicacion
          } else {
            // Volver
          }
        });
      },

      _onShowMsg8: function (oEvent, oValue) {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgcantidad") + " " + oValue,
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === this._i18n().getText("btnvolver")) {
            oEvent.getSource().setValue("");
            this._onFocusControl(oEvent.getSource());
          }
        });
      },
    });
  }
);
