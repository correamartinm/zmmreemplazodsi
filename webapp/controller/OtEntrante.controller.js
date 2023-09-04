sap.ui.define(
  ["./BaseController", "sap/ui/core/ValueState"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.ValueState} ValueState
   */
  function (BaseController, ValueState) {
    "use strict";

    return BaseController.extend(
      "morixe.zmmreemplazodsi.controller.OtEntrante",
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
          this._onUpdateJsonModel(oMockModel, "/inOTPallet", "");
          this._onUpdateJsonModel(oMockModel, "/inOTDestino", "");
          this._onUpdateJsonModel(oMockModel, "/inOTAlmmacen", "");
          this._onUpdateJsonModel(oMockModel, "/inOTCodigo", "");
          this._onUpdateJsonModel(oMockModel, "/inOTValidate", false);
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

        _onShowMsg: function() {
          
          let Actions = [sap.m.MessageBox.Action.CLOSE, "NEXT"];
          let sMessage = this._i18n().getText("msgvolver"),

          sMessageTitle = this._i18n().getText("msgconsulta");
          this._onShowMsgBoxNextPositions(sMessage, sMessageTitle, Actions).then((rta) => {
            if (rta === "NEXT") {
              this._onResetData();
              this.onGoMain();
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

          //   oModel = this.getView().getModel(),
          //   oView = this.getView(),
          //   that = this;

          // var oKey = oModel.createKey("/PalletSet", {
          //   Pallet: oPallet,
          //   Destino: oDestino,
          // });
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
              this._onUpdateJsonModel(oMockModel, "/inOTValidate", rta);

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
