sap.ui.define(
  ["./BaseController", "sap/ui/core/ValueState"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} BaseController
   * @param {typeof sap.ui.core.ValueState} ValueState
   */
  function (BaseController, ValueState) {
    "use strict";

    return BaseController.extend("morixe.zmmreemplazodsi.controller.Salidas", {
      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        let oTarget = oRouter.getTarget("TargetOtSaliente");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },

      _onObjectMatched: function (evt) {
        this._onFocusControl(this.byId("idOtOutInput"));
      },



      onPicking: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oActualValue = oMockModel.getProperty("/Picking");
        oMockModel.setProperty("/Picking", !oActualValue);
      },
      onPikingData: function (oEvent) {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          obj = oEvent.getSource().getBindingContext("mockdata").getObject(),
          oItem = {
            Spalletcodigo: obj.PALLET,
            Sotnumero: obj.OT,
            Setapa: obj.ETAPA,
            Svalpalletcodigo: "",
            Sorigen: obj.ORIGEN,
            Svalorigen: "",
            Sdestino: obj.DESTINO,
            Svaldestino: "",
            Smaterialcodigo: "",
            Smaterialdesc: "",
          };
        oMockModel.setProperty("/Salida", oItem);
        this.onPicking();
      },

      onCancelPicking: function () {
        this._onResetPikingData();
        this.onPicking();
      },
      _onResetPikingData: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        oMockModel.setProperty("/Salida", []);
      },

      onInputOtScanSubmit: function (oEvent) {
        let oValue = oEvent.getSource().getValue(),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),
          oEntity = "/**********",
          oTarget = oEvent.getSource();
        if (oValue) {
          oTarget.setValueState(ValueState.None);
          // let oData = this_onreadModel(oModel, oView, oEntity);
        } else {
          oTarget.setValueState(ValueState.Error);
        }
      },
      _onShowMsg1: function () {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgcodigo"),
          icono: sap.m.MessageBox.Icon.QUESTION,
          acciones: [
            this._i18n().getText("btnvolver")
          ],
          resaltar: this._i18n().getText("btnvolver"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          // if (rta === this._i18n().getText("btnvolver")) {
            
          // }
        });
      },

      _onShowMsg2: function () {
        let objectMsg = {
          titulo: this._i18n().getText("btnsalidaventas"),
          mensaje: this._i18n().getText("msgpalletcontenido"),
          icono: sap.m.MessageBox.Icon.QUESTION,
          acciones: [
            this._i18n().getText("btnvolver"),
            this._i18n().getText("btnconfirm")
          
            
          ],
          resaltar:  this._i18n().getText("btnconfirm"),
        };

        this._onShowMsgBox(objectMsg).then((rta) => {
          if (rta === "CLOSE") {
            
          }
        });
      },
    });
  }
);
