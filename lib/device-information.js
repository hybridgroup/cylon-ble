/*
 * cylon-ble DeviceInformation driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var DeviceInformation = '180a',
    ModelNumber = '2a24',
    SystemId = '2a23',
    FirmwareRevision = '2a26',
    HardwareRevision = '2a27',
    ManufacturerName = '2a29',
    PnPId = '2a50';

var BLEDeviceInformation = module.exports = function BLEDeviceInformation(opts) {
  BLEDeviceInformation.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || DeviceInformation;

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

BLEDeviceInformation.prototype.getModelNumber = function(callback) {
  this._getServiceCharacteristic(ModelNumber, callback);
};

BLEDeviceInformation.prototype.getSystemId = function(callback) {
  this._getServiceCharacteristic(SystemId, callback);
};

BLEDeviceInformation.prototype.getHardwareRevision = function(callback) {
  this._getServiceCharacteristic(HardwareRevision, function(err, data) {
    if (data !== null) {
      data = data.toString();
    }
    callback(err, data);
  });
};

BLEDeviceInformation.prototype.getFirmwareRevision = function(callback) {
  this._getServiceCharacteristic(FirmwareRevision, function(err, data) {
    if (data !== null) {
      data = data.toString();
    }
    callback(err, data);
  });
};

BLEDeviceInformation.prototype.getManufacturerName = function(callback) {
  this._getServiceCharacteristic(ManufacturerName, function(err, data) {
    if (data !== null) {
      data = data.toString();
    }
    callback(err, data);
  });
};

BLEDeviceInformation.prototype.getPnPId = function(callback) {
  this._getServiceCharacteristic(PnPId, callback);
};

BLEDeviceInformation.prototype._getServiceCharacteristic = function(characteristicId, callback) {
  this.connection.readServiceCharacteristic(this.serviceId, characteristicId, callback);
};
