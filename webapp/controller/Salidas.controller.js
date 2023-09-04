sap.ui.define(
  ["./BaseController", "sap/ui/core/ValueState"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.ValueState} ValueState
   */
  function (BaseController, ValueState) {
    "use strict";

    return BaseController.extend(
      "morixe.zmmreemplazodsi.controller.OtSaliente",
      {
        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          let oTarget = oRouter.getTarget("TargetOtSaliente");
          oTarget.attachDisplay(this._onObjectMatched, this);
        },

        _onObjectMatched: function (evt) {
          this._onFocusControl(this.byId("idOtOutInput"));
        },


        _onGotoMainMenu: function () {
          let sMessage = this._i18n().getText("msgvolver"),
            sMessageTitle = this._i18n().getText("msgconsulta");

          this._onShowMsgBoxConfirm(sMessage, sMessageTitle).then((rta) => {
            if (rta === "OK") {
              // this._onResetPikingData();
              this.onGoMain();
            }
          });
        },
        onPicking: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oActualValue = oMockModel.getProperty("/Picking");
          oMockModel.setProperty("/Picking", !oActualValue);
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
      }
    );
  }
);
