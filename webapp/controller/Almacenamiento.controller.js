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
          oTarget.attachDisplay(this._onObjectMatched, this);
        },

        _onObjectMatched: function (evt) {
          this._onFocusControl(this.byId("idOtInPalletInput"));
        },
        _onResetData: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          oMockModel.setProperty("/Almacenamiento", {
            Apalletcodigo: "",
            Aotnumero: "",
            Aetapa: "",
            Avalpalletcodigo: "",
            Aorigen: "",
            Avalorigen: "",
            Adestino: "",
            Avaldestino: "",
            Amaterialcodigo: "",
            Amaterialdesc: "",
          });
        },



        _onShowMsg1: function () {
          let objectMsg = {
            titulo: this._i18n().getText("lblalmacenamiento"),
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
            titulo: this._i18n().getText("lblalmacenamiento"),
            mensaje: this._i18n().getText("msgpalletcontenido"),
            icono: sap.m.MessageBox.Icon.QUESTION,
            acciones: [
              this._i18n().getText("btnvolver"),
              this._i18n().getText("btnllevardestino"),
              this._i18n().getText("btnllevarremanejo")
              
            ],
            resaltar:  this._i18n().getText("btnvolver"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            if (rta === "CLOSE") {
              
            }
          });
        },

        onInputScanSubmit: function (oEvent) {
          let oValue = oEvent.getSource().getValue(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oTarguetName = oEvent.getSource().getName(),
            oTarguet = oEvent.getSource(),
            oPallet = this.byId("idOtInPalletInput"),
            oDestino = this.byId("idDestinoInput"),
            oCodigo = this.byId("idCodigoInput");

          if (oValue.length < 1) return;

          switch (oTarguetName) {
            case "inPallet":
              this._onFocusControl(oDestino);
              break;

            case "inDestino":
              this._onFocusControl(oCodigo);

              break;
            case "inCodigo":
              let rta = this._onCompareControls(oPallet, oCodigo);
              oMockModel.setProperty("/inOTValidate", rta);

              if (rta === false) {
                oTarguet.setValueState(ValueState.Error);
              } else {
                oTarguet.setValueState(ValueState.None);
              }

              break;
            // default:
            //   break;
          }
        },
      }
    );
  }
);
