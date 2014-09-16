/*
 * cylon-ble driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 Your Name Here
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Driver = module.exports = function Driver(opts) {
  Driver.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId;
  this.characteristicId = extraParams.characteristicId;

  this.commands = {
    getServiceCharacteristic: this.getServiceCharacteristic
  };
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

Driver.prototype.start = function(callback) {
  Driver.__super__.start.apply(this, arguments);
};

Driver.prototype.getServiceCharacteristic = function(cb) {
  this.connection.getServiceCharacteristic(this.serviceId, this.characteristicId, cb);
}
