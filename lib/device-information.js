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
  BLEDeviceInformation.__super__.start.apply(this, arguments);
};

BLEDeviceInformation.prototype.getManufacturerName = function(cb) {
  this._getServiceCharacteristic('2a29', function(err, data) {
    if (data !== null) {
      data = data.toString();
    }
    cb(err, data);
  });
}

BLEDeviceInformation.prototype.getModelNumber = function(cb) {
  this._getServiceCharacteristic('2a24', cb);
}

BLEDeviceInformation.prototype.getSystemId = function(cb) {
  this._getServiceCharacteristic('2a23', cb);
}

BLEDeviceInformation.prototype._getServiceCharacteristic = function(characteristicId, cb) {
  this.connection.getServiceCharacteristic(this.serviceId, characteristicId, cb);
}
