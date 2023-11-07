sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
  ],
  function (Controller, MessageBox, History) {
    "use strict";

    return Controller.extend(
      "morixe.zmmreemplazodsi.controller.BaseController",
      {
        onGoMain: function () {
          // oMockModel.setProperty("/MainButtons", false);
          this.getOwnerComponent().getTargets().display("TargetMainView");
        },
        _onGotoMainMenu: function () {
          let objectMsg = {
            titulo: this._i18n().getText("msgconsulta"),
            mensaje: this._i18n().getText("msgvolver"),
            icono: sap.m.MessageBox.Icon.QUESTION,
            acciones: [
              sap.m.MessageBox.Action.CLOSE,
              sap.m.MessageBox.Action.OK,
            ],
            resaltar: sap.m.MessageBox.Action.OK,
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            if (rta === "OK") {
              // this._onResetData();
              this.onGoMain();
            }
          });
        },

        _i18n: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _onFocusControl: function (oControl) {
          jQuery.sap.delayedCall(700, this, function () {
            oControl.focus();
          });
        },

        _onCompareControls: function (oControl1, oControl2) {
          let oValue1 = oControl1.getValue(),
            oValue2 = oControl2.getValue();

          if (oValue1 === oValue2) {
            return true;
          } else {
            return false;
          }
        },

        _onreadModel: function (oModel, oView, oPath, oEvent) {
          return new Promise((resolve, reject) => {
            let that = this;
            oView.setBusy(true);
            oModel.read(oPath, {
              success: jQuery.proxy(function (oData) {
                oView.setBusy(false);
                resolve(oData);
              }, this),
              error: function (oError) {
                oView.setBusy(false);
                oEvent.getSource().setValue(null);
                that._onFocusControl(oEvent.getSource());
                that._onErrorHandle(oError);
              },
            });
          });
        },

        _onfilterModel: function (oModel, oView, oEntity, oFilters) {
          return new Promise((resolve, reject) => {
          oView.setBusy(true);
          oModel.read(oEntity, {
            filters: [oFilters],
            success: jQuery.proxy(function (oData) {
              oView.setBusy(false);
              resolve(oData);
            }, this),
            error: function (oError) {
              oView.setBusy(false);
              resolve(oError);
            },
          });
        });
        },

        _oncreateModel: function (oModel, oView, oEntity, oPayload) {
          oView.setBusy(true);
          oModel.create(oEntity, oPayload, {
            success: function (oData) {
              oView.setBusy(false);

              if (oData.Tipo === "E") {
                // Error
              } else {
                oModel.refresh;
                // Correcto
              }
            }.bind(this),

            error: function (oError) {
              oView.setBusy(false);

              // Reiniciar
            }.bind(this),
          });
        },

        onupdateModel: function (oModel, oView, oPath, oPayload) {
          oView.setBusy(true);
          oModel.update(oPath, oPayload, {
            success: function (oData) {
              oView.setBusy(false);

              if (oData.Tipo === "E") {
                // Error
              } else {
                oModel.refresh;
                // Correcto
              }
            }.bind(this),

            error: function (oError) {
              oView.setBusy(false);

              // Reiniciar
            }.bind(this),
          });
        },

        ondeleteModel: function (oModel, oView, oPath) {
          oView.setBusy(true);
          oModel.remove(oPath, {
            method: "DELETE",
            success: function (oData) {
              oView.setBusy(false);
              oModel.refresh;
            },
            error: function (oError) {
              oView.setBusy(false);
            },
          });
        },

        _onErrorHandle: function (oError) {
          var oErrorMsg = JSON.parse(oError.responseText);
          var oText = oErrorMsg.error.message.value;
          var oText = oErrorMsg.error.innererror.errordetails[0];
          var sMessageTitle = this._i18n().getText("msgerror");
          var oDta = JSON.parse(oError.responseText);
          var oText = oDta.error.message.value;

          let objectMsg = {
            titulo: sMessageTitle,
            mensaje: oText,
            icono: sap.m.MessageBox.Icon.ERROR,
            acciones: [sap.m.MessageBox.Action.CLOSE],
            resaltar: sap.m.MessageBox.Action.CLOSE,
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            if (rta === "CLOSE") {
            }
          });
        },

        _onShowMsgBox: function (MsgObj) {
          return new Promise((resolve, reject) => {
            MessageBox.show(MsgObj.mensaje, {
              icon: MsgObj.icono,
              title: MsgObj.titulo,
              onClose: function (oAction) {
                resolve(oAction);
              }.bind(this),
              styleClass:
                "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
              actions: MsgObj.acciones,
              emphasizedAction: MsgObj.resaltar,
            });
          });
        },
      }
    );
  }
);
