/*
 * cylon-ble BatteryService driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var Driver = require("./driver");

var BatteryService = "180f",
    BatteryLevel = "2a19";

var BLEBatteryService = module.exports = function BLEBatteryService(opts) {
  BLEBatteryService.__super__.constructor.apply(this, arguments);

  this.serviceId = opts.serviceId || BatteryService;

  this.commands = {
    getBatteryLevel: this.getBatteryLevel
  };
};

Cylon.Utils.subclass(BLEBatteryService, Driver);

/**
 * Gets the current battery level of the BLE device
 *
 * @param {Function} callback to be triggered when battery data is read
 * @return {void}
 * @publish
 */
BLEBatteryService.prototype.getBatteryLevel = function(callback) {
  this._getServiceCharacteristic(BatteryLevel, function(err, data) {
    if (data !== null) {
      data = data.readUInt8(0);
    }
    callback(err, data);
  });
};
