"use strict";

var Central = require("./lib/central");

var Drivers = {
  "ble-battery-service": require("./lib/battery-service"),
  "ble-generic-access": require("./lib/generic-access"),
  "ble-device-information": require("./lib/device-information"),
  "ble-characteristic": require("./lib/characteristic")
};

module.exports = {
  adaptors: ["ble", "central"],
  drivers: Object.keys(Drivers),

  adaptor: function(opts) {
    return new Central(opts);
  },

  driver: function(opts) {
    opts = opts || {};

    if (!Drivers[opts.driver]) {
      return null;
    }

    return new Drivers[opts.driver](opts);
  }
};
