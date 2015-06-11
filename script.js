"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: "central", module: __dirname }
  },

  devices: { },

  work: function(my) {
    my.bluetooth.on("discover", function(peripheral) {
      console.log(peripheral.uuid, peripheral.rssi);
    });
  }
}).start();
