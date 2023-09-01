/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "morixe/zmmreemplazodsi/model/models",
  ],
  function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("morixe.zmmreemplazodsi.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // enable routing
        this.getRouter().initialize();

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        var oMockDataModel = new sap.ui.model.json.JSONModel({
          Usuario: [
            {
              User: "",
              id: 0,
              firstname: "Usuario",
              lastname: "Dummy",
              email: "dummy.user@com",
              name: "User Dummy ",
              user: "XXXX",
              displayName: "Usuario Test (dummy.user@com)",
            },
          ],
          MainButtons : false,
          inOTPallet: "",
          inOTDestino: "",
          inOTAlmmacen: "",
          inOTCodigo: "",
          inOTValidate: false,
          outOT: "",
          outOTPosicion: "",
          outOTMaterial: "",
          outOTMaterialDesc: "",
          outOTCantidad: "",
          outOTUnidad: "",
          outOTPallet: "",
          outOTValidate: false,
          movdata: {
            movOT: "",
            movOTPosicion: "",
            movOTMaterial: "",
            movOTMaterialDesc: "",
            movOTCantidad: "",
            movOTUnidad: "",
            movOTPallet: "",
            movOTValidate: false,
          },
        });
        this.setModel(oMockDataModel, "mockdata");
      },
    });
  }
);
