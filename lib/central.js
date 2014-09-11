/*
 * cylon-ble adaptor for centrals
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Central = module.exports = function Central(opts) {
  if (opts == null) {
    opts = {};
  }

  Central.__super__.constructor.apply(this, arguments);
};

Cylon.Utils.subclass(Central, Cylon.Adaptor);

// Include a list of commands that will be make availble to the connection;
// which means they will be used by the drivers.
Central.prototype.commands = [];

Central.prototype.connect = function(callback) {
  Central.__super__.connect.apply(this, arguments);
};
