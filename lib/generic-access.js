/*
 * cylon-ble GenericAccess driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var GenericAccess = module.exports = function GenericAccess(opts) {
  GenericAccess.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || '1800';

  this.commands = {
    getDeviceName: this.getDeviceName,
    getAppearance: this.getAppearance
  };
};

Cylon.Utils.subclass(GenericAccess, Cylon.Driver);

GenericAccess.prototype.start = function(callback) {
  GenericAccess.__super__.start.apply(this, arguments);
};

GenericAccess.prototype.getDeviceName = function(cb) {
  this._getServiceCharacteristic('2a00', cb);
}

GenericAccess.prototype.getAppearance = function(cb) {
  this._getServiceCharacteristic('2a01', cb);
}

GenericAccess.prototype._getServiceCharacteristic = function(characteristicId, cb) {
  this.connection.getServiceCharacteristic(this.serviceId, characteristicId, cb);
}
