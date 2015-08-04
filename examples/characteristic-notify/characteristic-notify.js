"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: "central", uuid: "207377654321",
                 module: "cylon-ble" }
  },

  devices: {
    wiced: { driver: "ble-characteristic",
             serviceId: "739298b687b64984a5dcbdc18b068985",
             characteristicId: "33ef91133b55413eb553fea1eaada459",
             connection: "bluetooth" }
  },

  work: function(my) {
    my.wiced.notifyCharacteristic(function(err, data) {
      if (!!err) {
        console.log("Error: ", err);
        return;
      }

      console.log("Data: ", data);
    });
  }
}).start();
