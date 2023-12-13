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

        let oTarget = oRouter.getTarget("TargetMovimiento");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },

      _onObjectMatched: function (evt) {
        this._onFocusControl(this.byId("idMovPalletInput"));
      },

      _onResetData: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/Remanejo", {
          Rpalletcodigo: "",
          Totnumero: "",
          Tnuevonumero: "",
        });
        oMockModel.setProperty("/MaterialesAdded", []);
        oMockModel.setProperty("/MaterialesAddedCount", "");
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
          oPath = oItems[index].getBindingContextPath();
          vObject = oMockModel.getObject(oPath);
          vObject.Ingreso = oItems[index].getCells()[2].getValue();
          oSelectedData.push(vObject);

          let rta = await this._onupdateModel(oModel, oView, oPath, vObject);

          if (rta.Respuesta === "OK") {
            if (rta.Datos.TipoMensaje !== "E") {
              oMockModel.setProperty("/MaterialesAdded", oSelectedData);
              oMockModel.setProperty(
                "/MaterialesAddedCount",
                oSelectedData.length
              );
            } else {
              console.log("Error:"+rta.Datos);
            }
          }
        }
        // cambio pantalla
        oMockModel.setProperty("/Remanejo", 1);
      },
      onTableMaterialesSelectionChange: function (oEvent) {
        let oTable = this.getView().byId("idMaterialStock"),
          oMockModel = this.getView().getModel("mockdata"),
          oItems = oTable.getItems(),
          oPath,
          vObject;
        oMockModel.setProperty(
          "/MaterialesAddedCount",
          oTable.getSelectedItems.length
        );

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
                oItems[index].getCells()[2].setValue(vObject.Disponible);
              } else {
                oItems[index]
                  .getCells()[2]
                  .setValue(parseFloat(vObject.Disponible) * -1);
              }
              vObject.Aplicado = oItems[index].getCells()[2].getValue();
            }

            oItems[index]
              .getCells()[2]
              .setValueState(sap.ui.core.ValueState.None);

            this._onFocusControl(oItems[index].getCells()[2]);
          }
        }
      },



      oncheckcantidad: function (oEvent) {
        let oTarget = oEvent.getSource(),
          oStockTable = this.getView().byId("idMaterialStock"),
          oMax = oEvent.getSource().getParent().getCells()[2].getText(),
          oValue = oTarget.getValue();
        let oItem = oStockTable.getSelectedItem();

        oValue = parseFloat(oValue);
        oMax = parseFloat(oMax);

        if (oValue > 0 && oValue <= oMax) {
          oTarget.setValueState(ValueState.None);
        } else {
          oTarget.setValueState(ValueState.Warning);
        }

        this._onCheckPago();
      },



      onCancelarSeleccionButtonPress: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/MaterialesAdded", []);
        oMockModel.setProperty("/Materiales", []);
        oMockModel.setProperty("/MaterialesAddedCount", "");
        oMockModel.setProperty("/RemanejoScanMaterial", "");
        oMockModel.setProperty("/Remanejo", 1);
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

      _onShowMsg2: function () {
        let objectMsg = {
          titulo: this._i18n().getText("lblremanejo"),
          mensaje: this._i18n().getText("msgtrascantidad"),
          icono: sap.m.MessageBox.Icon.WARNING,
          acciones: [this._i18n().getText("btnvolver")],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === "CLOSE") {
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
