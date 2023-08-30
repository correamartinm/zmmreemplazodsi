sap.ui.define(
  ["./BaseController"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController) {
    "use strict";

    return BaseController.extend("morixe.zmmreemplazodsi.controller.OtMovimiento", {
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
        this._onUpdateJsonModel(oMockModel, "/movOT", "");
        this._onUpdateJsonModel(oMockModel, "/movOTPosicion", "");
        this._onUpdateJsonModel(oMockModel, "/movOTMaterial", "");
        this._onUpdateJsonModel(oMockModel, "/movOTMaterialDesc", "");
        this._onUpdateJsonModel(oMockModel, "/movOTCantidad", "");
        this._onUpdateJsonModel(oMockModel, "/movOTUnidad", "");
        this._onUpdateJsonModel(oMockModel, "/movOTPallet", "");
        this._onUpdateJsonModel(oMockModel, "/movOTValidate", false);
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


    });
  }
);
