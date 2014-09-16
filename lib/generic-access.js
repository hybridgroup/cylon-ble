/*
 * cylon-ble GenericAccess driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var BLEGenericAccess = module.exports = function BLEGenericAccess(opts) {
  BLEGenericAccess.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || '1800';

  this.commands = {
    getDeviceName: this.getDeviceName,
    getAppearance: this.getAppearance
  };
};

Cylon.Utils.subclass(BLEGenericAccess, Cylon.Driver);

BLEGenericAccess.prototype.start = function(callback) {
  BLEGenericAccess.__super__.start.apply(this, arguments);
};

BLEGenericAccess.prototype.getDeviceName = function(cb) {
  this._getServiceCharacteristic('2a00', function(err, data) {
    if (data !== null) {
      data = data.toString();
    }
    cb(err, data);
  });  
}

BLEGenericAccess.prototype.getAppearance = function(cb) {
  this._getServiceCharacteristic('2a01', cb);
}

BLEGenericAccess.prototype._getServiceCharacteristic = function(characteristicId, cb) {
  this.connection.getServiceCharacteristic(this.serviceId, characteristicId, cb);
}
