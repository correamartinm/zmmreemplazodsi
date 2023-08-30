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
          this.getOwnerComponent().getTargets().display("TargetMainView");
        },

        _onFocusControl: function (oControl) {
          jQuery.sap.delayedCall(700, this, function () {
            oControl.focus();
          });
        },
        _onUpdateJsonModel: function (oModel, entity, values) {
          oModel.setProperty(entity, values);
        },

        _onGetDataJsonModel: function (model, entity) {
          if (model) {
            let data = model.getProperty(entity);
            return data;
          }
        },

        formatFecha: function (param) {
          let oFecha,
            oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
              pattern: "dd/MM/yyyy hh:mm",
              UTC: true,
            });

          if (param !== null && param !== undefined && param !== "") {
            oFecha = oDateFormat.format(param);
            return oFecha;
          } else {
            return param;
          }
        },

        _onreadModel: function (oModel, oView, oPath) {
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
                that._onErrorHandle(oError);
              },
            });
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

        _onfilterModel: function (oModel, oView, oEntity, oFilters) {
          oView.setBusy(true);
          oModel.read(oEntity, {
            filters: [oFilters],
            success: jQuery.proxy(function (oData) {
              oView.setBusy(false);
            }, this),
            error: function (oError) {
              oView.setBusy(false);
            },
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

        _i18n: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _onErrorHandle: function (oError) {
          var oErrorMsg = JSON.parse(oError.responseText);
          var oText = oErrorMsg.error.message.value;
          var oText = oErrorMsg.error.innererror.errordetails[0];
          var sMessageTitle = this._i18n().getText("msgerror");
          var oDta = JSON.parse(oError.responseText);
          var oText = oDta.error.message.value;

          this._onShowMsgBoxError(oText, sMessageTitle).then((rta) => {
            // alert(rta);
          });
        },

        _onShowMsgBoxConfirm: function (sMessage, sMessageTitle) {
          return new Promise((resolve, reject) => {
            MessageBox.confirm(sMessage, {
              icon: MessageBox.Icon.QUESTION,
              title: sMessageTitle,
              onClose: function (oAction) {
                resolve(oAction);
              }.bind(this),
              styleClass: "",
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              emphasizedAction: MessageBox.Action.OK,
            });
          });
        },

        _onShowMsgBoxError: function (sMessage, sMessageTitle) {
          return new Promise((resolve, reject) => {
            MessageBox.error(sMessage, {
              icon: MessageBox.Icon.ERROR,
              title: sMessageTitle,
              onClose: function (oAction) {
                resolve(oAction);
              }.bind(this),
              styleClass: "",
              actions: MessageBox.Action.CLOSE,
              emphasizedAction: MessageBox.Action.CLOSE,
            });
          });
        },

        _onShowMsgBoxSucces: function (sMessage, sMessageTitle) {
          return new Promise((resolve, reject) => {
            MessageBox.success(sMessage, {
              icon: MessageBox.Icon.SUCCESS,
              title: sMessageTitle,
              onClose: function (oAction) {
                resolve(oAction);
              }.bind(this),
              styleClass: "",
              actions: sap.m.MessageBox.Action.OK,
              emphasizedAction: sap.m.MessageBox.Action.OK,
            });
          });
        },
      }
    );
  }
);
