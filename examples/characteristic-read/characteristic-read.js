"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: {
      adaptor: "central", uuid: "207377654321",
      module: "cylon-ble"
    }
  },

  devices: {
    wiced: {
      driver: "ble-characteristic",
      serviceId: "180f", characteristicId: "2a19",
      connection: "bluetooth"
    }
  },

  work: function(my) {
    my.wiced.readCharacteristic(function(err, data) {
      if (err) { return console.error("Error: ", err); }
      console.log("Data: ", data);
    });
  }
}).start();
