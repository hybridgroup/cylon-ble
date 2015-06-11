"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: "central", uuid: "207377654321", module: "cylon-ble" }
  },

  devices: {
    battery: { driver: "ble-battery-service" }
  },

  work: function(my) {
    my.battery.getBatteryLevel(function(err, data) {
      if (err) {
        console.log("error: ", err);
        return;
      }

      console.log("data: ", data);
    });
  }
}).start();
