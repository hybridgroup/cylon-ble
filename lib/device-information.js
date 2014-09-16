/*
 * cylon-ble DeviceInformation driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var DeviceInformation = module.exports = function DeviceInformation(opts) {
  DeviceInformation.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || '180a';

  this.commands = {
    getManufacturerName: this.getManufacturerName,
    getModelNumber: this.getModelNumber,
    getSystemId: this.getSystemId
  };
};

Cylon.Utils.subclass(DeviceInformation, Cylon.Driver);

DeviceInformation.prototype.start = function(callback) {
  DeviceInformation.__super__.start.apply(this, arguments);
};

DeviceInformation.prototype.getManufacturerName = function(cb) {
  this._getServiceCharacteristic('2a29', cb);
}

DeviceInformation.prototype.getModelNumber = function(cb) {
  this._getServiceCharacteristic('2a24', cb);
}

DeviceInformation.prototype.getSystemId = function(cb) {
  this._getServiceCharacteristic('2a23', cb);
}

DeviceInformation.prototype._getServiceCharacteristic = function(characteristicId, cb) {
  this.connection.getServiceCharacteristic(this.serviceId, characteristicId, cb);
}
