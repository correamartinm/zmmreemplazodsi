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

        _onObjectMatched: function (evt) {
          this._onFocusControl(this.byId("idMovPalletInput"));
        },
        /**
         * @override
         */
        onAfterRendering: function () {
          this._onFocusControl(this.byId("idMovPalletInput"));
        },

        _onResetData: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          oMockModel.setProperty("/Traslado", {
            Tpalletcodigo: "",
            Totnumero: "",
            Tetapa: "",
            Tvalpalletcodigo: "",
            Torigen: "",
            Tvalorigen: "",
            Tdestino: "",
            Tvaldestino: "",
            Tmaterialcodigo: "",
            Tmaterialdesc: "",
            Tcantidad: "",
            Talmacen: "",
          });
        },

        onEtiquetado: function () {
          
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oValue =  oMockModel.getProperty("/Etiquetado");
          oMockModel.setProperty("/Etiquetado", !oValue);

        },
        _onGotoMainMenu: function () {

          let objectMsg = {
            titulo : this._i18n().getText("msgconsulta"),
            mensaje : this._i18n().getText("msgvolver"),
            icono : sap.m.MessageBox.Icon.QUESTION, 
            acciones : [sap.m.MessageBox.Action.CLOSE, sap.m.MessageBox.Action.OK],
            resaltar : 		sap.m.MessageBox.Action.OK
            };


          this._onShowMsgBox(objectMsg).then((rta) => {
            if (rta === "OK") {
              this._onResetData();
              this.onGoMain();
            }
          });

        },
      }
    );
  }
);
