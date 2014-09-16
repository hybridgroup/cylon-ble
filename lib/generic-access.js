/*
 * cylon-ble driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 Your Name Here
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var GenericAccess = module.exports = function GenericAccess(opts) {
  GenericAccess.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId;
  this.characteristicId = extraParams.characteristicId;

  this.commands = {
    getServiceCharacteristic: this.getServiceCharacteristic
  };
};

Cylon.Utils.subclass(GenericAccess, Cylon.Driver);

GenericAccess.prototype.start = function(callback) {
  GenericAccess.__super__.start.apply(this, arguments);
};

GenericAccess.prototype.getServiceCharacteristic = function(cb) {
  this.connection.getServiceCharacteristic(this.serviceId, this.characteristicId, cb);
}
