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
          TestItems: [],
          Materiales: [],
          MaterialesAdded: [],
          MaterialesAddedCount: "",
          Almacenamiento: {
            Pallet: "",
            Destino: ""
          },
          AlmacenamientoScan: {
            Pallet: "",
            Destino: "",
          },

          Devolucion: {},
          RemanejoScan: {
            Ean11: "",
            Material: "",
            Esperada: "",
            Descripcion:""
          },
          DevolucionScan: {
            Material: "",
            Cantidad: "",
            Destino: "",
          },

          
          Traslado: {},
          TrasladoMaterialValidado: true,
          TrasladoScan: {
            Cantidad: "0"
          },
          Salida: {},
          SalidaxPallet: false,
          SalidaScan: {},
          Remanejo: {},
          ActiveCenter: "",
          Picking: false,
          Remanejo: 1,
          Etiquetado: true,
          MainButtons: false,
          EtiquIngxPallets: false,
          AlmValidAlmacenamiento: false,
          AlmValidDevolucion: false,
          AlmValidTraslado: false,
          AlmValidTrasladoSinEtiqueta: false,
          SalidaValida: false


        });
        this.setModel(oMockDataModel, "mockdata");
      },
    });
  }
);
