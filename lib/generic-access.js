/*
 * cylon-ble GenericAccess driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var Driver = require("./driver");

var appearances = require("./appearances.json");

var GenericAccess = "1800",
    DeviceName = "2a00",
    Appearance = "2a01";

var BLEGenericAccess = module.exports = function BLEGenericAccess(opts) {
  BLEGenericAccess.__super__.constructor.apply(this, arguments);

  this.serviceId = opts.serviceId || GenericAccess;

  this.commands = {
    getDeviceName: this.getDeviceName,
    getAppearance: this.getAppearance
  };
};

Cylon.Utils.subclass(BLEGenericAccess, Driver);

/**
 * Gets the name of the BLE device
 *
 * @param {Function} callback to be triggered when data is read
 * @return {void}
 * @publish
 */
BLEGenericAccess.prototype.getDeviceName = function(callback) {
  this._getServiceCharacteristic(DeviceName, function(err, data) {
    if (err) {
      return callback(err);
    }

    if (data !== null) {
      data = data.toString();
    }
    callback(err, data);
  });
};

/**
 * Gets the appearance descriptor of the BLE device
 *
 * @param {Function} callback to be triggered when data is read
 * @return {void}
 * @publish
 */
BLEGenericAccess.prototype.getAppearance = function(callback) {
  var self = this;
  this._getServiceCharacteristic(Appearance, function(err, data) {
    if (err) {
      return callback(err);
    }

    if (data !== null) {
      data = self.parseAppearance(data);
    }
    callback(err, data);
  });
};

BLEGenericAccess.prototype.appearances = appearances;

BLEGenericAccess.prototype.parseAppearance = function(data) {
  var val = data.readUInt16LE(0),
      unknown = { value: "Unknown value", description: "Unknown" };

  return this.appearances[val] || unknown;
};
