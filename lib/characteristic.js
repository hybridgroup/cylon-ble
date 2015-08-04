/*
 * cylon-ble Characteristic driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var Driver = require("./driver");

var BLECharacteristic = module.exports = function BLECharacteristic(opts) {
  BLECharacteristic.__super__.constructor.apply(this, arguments);

  this.serviceId = opts.serviceId;
  this.characteristicId = opts.characteristicId;

  this.commands = {
    readCharacteristic: this.readCharacteristic,
    writeCharacteristic: this.writeCharacteristic,
    notifyCharacteristic: this.notifyCharacteristic
  };
};

Cylon.Utils.subclass(BLECharacteristic, Driver);

/**
 * Reads the current value of characteristic of the BLE device
 *
 * @param {Function} callback to be triggered when characteristic data is read
 * @return {void}
 * @publish
 */
BLECharacteristic.prototype.readCharacteristic = function(callback) {
  this._getServiceCharacteristic(this.characteristicId, function(err, data) {
    callback(err, data);
  });
};

/**
 * Writes the current value of characteristic of the BLE device
 *
 * @param {Number} value value to write
 * @param {Function} callback function to call when done
 * @return {void}
 */
BLECharacteristic.prototype.writeCharacteristic = function(value, callback) {
  this.connection.writeServiceCharacteristic(this.serviceId,
                                             this.characteristicId,
                                             new Buffer(value),
    function(err, data) {
      if (typeof callback === "function") { callback(err, data); }
    }
  );
};

/**
 * Gets notifications from the BLE device
 *
 * @param {Function} callback to be triggered when data is retrieved
 * @return {void}
 * @publish
 */
BLECharacteristic.prototype.notifyCharacteristic = function(callback) {
  this.connection.notifyServiceCharacteristic(
    this.serviceId,
    this.characteristicId,
    true,
    function(err, data) {
      callback(err, data);
    }
  );
};
