/*
 * cylon-ble
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Central = require('./central'),
    Driver = require('./driver');

module.exports = {
  adaptor: function(opts) {
    return new Central(opts);
  },

  driver: function(opts) {
    return new Driver(opts);
  },

  register: function(robot) {
    robot.registerAdaptor('cylon-ble', 'central');
    robot.registerDriver('cylon-ble', 'generic');
  }
};
