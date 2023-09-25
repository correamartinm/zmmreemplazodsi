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
          TestItems: [
            {
              OT : 123456,
              ETAPA : 25,
              ORIGEN: 87898989,
              PALLET: 987654,
              DESTINO: 7777
            },
            {
              OT : 423456,
              ETAPA : 15,
              ORIGEN: 87898449,
              PALLET: 987654,
              DESTINO: 7777
            },
            {
              OT : 323456,
              ETAPA : 12,
              ORIGEN: 87338989,
              PALLET: 987654,
              DESTINO: 7777
            },
            {
              OT : 223456,
              ETAPA : 26,
              ORIGEN: 12898989,
              PALLET: 447654,
              DESTINO: 7777
            }
          ],
          Materiales : [
            {
              Codigo : "0001",
              Descripcion : "Material Test 1",
              Lote: "123",
              Cantidad: "10"
            }, {
              Codigo : "0002",
              Descripcion : "Material Test 2",
              Lote: "654",
              Cantidad: "12"
            }, {
              Codigo : "0003",
              Descripcion : "Material Test 3",
              Lote: "987",
              Cantidad: "14"
            }, {
              Codigo : "0004",
              Descripcion : "Material Test 4",
              Lote: "13",
              Cantidad: "20"
            }
          ],
          Almacenamiento: {
            Apalletcodigo: "",
            Aotnumero: "",
            Aetapa: "",
            Avalpalletcodigo: "",
            Aorigen : "",
            Avalorigen: "",
            Adestino : "",
            Avaldestino: "",
            Amaterialcodigo : "",
            Amaterialdesc : ""
          },
          Salida: {
            Spalletcodigo: "",
            Sotnumero: "",
            Setapa: "",
            Svalpalletcodigo: "",
            Sorigen : "",
            Svalorigen: "",
            Sdestino : "",
            Svaldestino: "",
            Smaterialcodigo : "",
            Smaterialdesc : ""
            
          },
          Traslado: {
            Tpalletcodigo: "",
            Totnumero: "",
            Tetapa: "",
            Tvalpalletcodigo: "",
            Torigen : "",
            Tvalorigen: "",
            Tdestino : "",
            Tvaldestino: "",
            Tmaterialcodigo : "",
            Tmaterialdesc : "",
            Tcantidad: "",
            Talmacen: ""
          },
          Remanejo: {
            Rpalletcodigo: "",
            Totnumero: "",
            Tnuevonumero: ""
          },
          ActiveCenter : "",
          Picking : false,
          Remanejo : 1,
          MainButtons : false   
        });
        this.setModel(oMockDataModel, "mockdata");
      },
    });
  }
);
