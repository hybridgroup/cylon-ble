/*
 * cylon-ble
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Central = require("./central");

var Drivers = {
  "ble-battery-service": require("./battery-service"),
  "ble-generic-access": require("./generic-access"),
  "ble-device-information": require("./device-information")
};

module.exports = {
  adaptors: ["ble", "central"],
  drivers: Object.keys(Drivers),

  adaptor: function(opts) {
    return new Central(opts);
  },

  driver: function(opts) {
    for (var d in Drivers) {
      if (opts.driver === d) {
        return new Drivers[d](opts);
      }
    }

    return null;
  }
};
