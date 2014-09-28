/*
 * cylon-ble BatteryService driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var BLEBatteryService = module.exports = function BLEBatteryService(opts) {
  BLEBatteryService.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || '180f';

  this.commands = {
    getBatteryLevel: this.getBatteryLevel
  };
};

Cylon.Utils.subclass(BLEBatteryService, Cylon.Driver);

BLEBatteryService.prototype.start = function(callback) {
  callback();
};

BLEBatteryService.prototype.halt = function(callback) {
  callback();
};

BLEBatteryService.prototype.getBatteryLevel = function(callback) {
  this._getServiceCharacteristic('2a19', function(err, data) {
    if (data !== null) {
      data = data.readUInt8(0);
    }
    callback(err, data);
  });
};

BLEBatteryService.prototype._getServiceCharacteristic = function(characteristicId, callback) {
  this.connection.readServiceCharacteristic(this.serviceId, characteristicId, callback);
};
