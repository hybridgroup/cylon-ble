/*
 * cylon-ble
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Central = require('./central');

var Drivers = {
  'battery-service': require('./battery-service'),
  'generic-access': require('./generic-access'),
  'device-information': require('./device-information')
};


module.exports = {
  adaptor: function(opts) {
    return new Central(opts);
  },

  driver: function(opts) {
    for (var d in Drivers) {
      if (opts.name === d) {
        return new Drivers[d](opts);
      }
    }

    return null;
  },

  register: function(robot) {
    robot.registerAdaptor('cylon-ble', 'central');
    for (var d in Drivers) {
      robot.registerDriver('cylon-ble', d);
    }
  }
};
