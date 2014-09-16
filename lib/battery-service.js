/*
 * cylon-ble BatteryService driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var BatteryService = module.exports = function BatteryService(opts) {
  BatteryService.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || '180f';

  this.commands = {
    getBatteryLevel: this.getBatteryLevel
  };
};

Cylon.Utils.subclass(BatteryService, Cylon.Driver);

BatteryService.prototype.start = function(callback) {
  BatteryService.__super__.start.apply(this, arguments);
};

BatteryService.prototype.getBatteryLevel = function(cb) {
  this._getServiceCharacteristic('2a19', cb);
}

BatteryService.prototype._getServiceCharacteristic = function(characteristicId, cb) {
  this.connection.getServiceCharacteristic(this.serviceId, characteristicId, cb);
}
