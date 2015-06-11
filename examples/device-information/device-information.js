"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: "central", uuid: "207377654321", module: "cylon-ble" }
  },

  devices: {
    deviceInfo: { driver: "ble-device-information" }
  },

  work: function(my) {
    my.deviceInfo.getManufacturerName(function(err, data) {
      if (err) {
        console.log("error: ", err);
        return;
      }

      console.log("data: ", data);
    });
  }
}).start();
