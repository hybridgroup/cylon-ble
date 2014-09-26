/*
 * cylon-ble DeviceInformation driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var BLEDeviceInformation = module.exports = function BLEDeviceInformation(opts) {
  BLEDeviceInformation.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || '180a';

  this.commands = {
    getManufacturerName: this.getManufacturerName,
    getModelNumber: this.getModelNumber,
    getSystemId: this.getSystemId
  };
};

Cylon.Utils.subclass(BLEDeviceInformation, Cylon.Driver);

BLEDeviceInformation.prototype.start = function(callback) {
  callback();
};

BLEDeviceInformation.prototype.halt = function(callback) {
  callback();
};

BLEDeviceInformation.prototype.getManufacturerName = function(callback) {
  this._getServiceCharacteristic('2a29', function(err, data) {
    if (data !== null) {
      data = data.toString();
    }
    callback(err, data);
  });
};

BLEDeviceInformation.prototype.getModelNumber = function(callback) {
  this._getServiceCharacteristic('2a24', callback);
};

BLEDeviceInformation.prototype.getSystemId = function(callback) {
  this._getServiceCharacteristic('2a23', callback);
};

BLEDeviceInformation.prototype._getServiceCharacteristic = function(characteristicId, callback) {
  this.connection.getServiceCharacteristic(this.serviceId, characteristicId, callback);
};
