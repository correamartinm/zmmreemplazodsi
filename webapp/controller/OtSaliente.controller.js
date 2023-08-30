sap.ui.define(
  ["./BaseController", "sap/ui/core/ValueState"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.ValueState} ValueState
   */
  function (BaseController, ValueState) {
    "use strict";

    return BaseController.extend("morixe.zmmreemplazodsi.controller.OtSaliente", {
      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        let oTarget = oRouter.getTarget("TargetOtSaliente");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },


      _onObjectMatched: function (evt) {
        this._onFocusControl(this.byId("idOtOutInput"));        
      },

      _onResetData: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        this._onUpdateJsonModel(oMockModel, "/outOT", "");
        this._onUpdateJsonModel(oMockModel, "/outOTPosicion", "");
        this._onUpdateJsonModel(oMockModel, "/outOTMaterial", "");
        this._onUpdateJsonModel(oMockModel, "/outOTMaterialDesc", "");
        this._onUpdateJsonModel(oMockModel, "/outOTCantidad", "");
        this._onUpdateJsonModel(oMockModel, "/outOTUnidad", "");
        this._onUpdateJsonModel(oMockModel, "/outOTPallet", "");
        this._onUpdateJsonModel(oMockModel, "/outOTValidate", false);
      },

      _onGotoMainMenu: function () {
        let sMessage = this._i18n().getText("msgvolver"),
          sMessageTitle = this._i18n().getText("msgconsulta");

        this._onShowMsgBoxConfirm(sMessage, sMessageTitle).then((rta) => {
          if (rta === "OK") {
            this._onResetData();
            this.onGoMain();
          }
        });
      },



      onInputOtScanSubmit: function (oEvent) {

        let oValue = oEvent.getSource().getValue(),
        oModel = this.getOwnerComponent().getModel(),
        oView = this.getView(),
        oEntity = "/**********",
        oTarget = oEvent.getSource();
        if (oValue){
          oTarget.setValueState(ValueState.None);
          // let oData = this_onreadModel(oModel, oView, oEntity);
        } else {
          oTarget.setValueState(ValueState.Error);
        }
      },




    });
  }
);
