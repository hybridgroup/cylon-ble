"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: "central", uuid: "207377654321", module: "cylon-ble" }
  },

  devices: {
    generic: { driver: "ble-generic-access" }
  },

  work: function(my) {
    my.generic.getDeviceName(function(err, data) {
      if (err) {
        console.log("error: ", err);
        return;
      }

      console.log("data: ", data);
    });
  }
}).start();
