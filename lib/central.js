/*
 * cylon-ble adaptor for centrals
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* jshint maxlen:false */

"use strict";

var Cylon = require("cylon");

var Central = module.exports = function Central(opts) {
  opts = opts || {};

  Central.__super__.constructor.apply(this, arguments);

  this.bleConnect = require("./noble");
  this.isConnected = false;
  this.uuid = opts.uuid ; // TODO: handle array of UUIDs
  this.connectedPeripherals = {};
};

Cylon.Utils.subclass(Central, Cylon.Adaptor);

/**
 * Connects to the BLE peripheral
 *
 * @param {Function} callback to be triggered when connected
 * @return {null}
 */
Central.prototype.connect = function(callback) {
  this.bleConnect.on("discover", function(peripheral) {
    if (peripheral.uuid === this.uuid) {
      var p = { peripheral: peripheral, connected: false };
      this.connectedPeripherals[peripheral.uuid] = p;

      this.bleConnect.stopScanning();

      this.isConnected = true;
      callback(null);
    }
  }.bind(this));

  this.bleConnect.startScanning();
};

/**
 * Disconnects from the BLE peripheral
 *
 * @param {Function} callback to be triggered when disconnected
 * @return {null}
 */
Central.prototype.disconnect = function(callback) {
  callback();
};

/**
 * Tells the BLE adaptor to start scanning for peripherals
 *
 * @return {null}
 * @publish
 */
Central.prototype.startScanning = function() {
  this.bleConnect.startScanning();
};

/**
 * Tells the BLE adaptor to stop scanning for peripherals
 *
 * @return {null}
 * @publish
 */
Central.prototype.stopScanning = function() {
  this.bleConnect.stopScanning();
};

/**
 * Returns all connected peripherals Central is aware of
 *
 * @return {Object} connected peripherals
 * @publish
 */
Central.prototype.peripherals = function() {
  return this.connectedPeripherals;
};

/**
 * Reads a service characteristic from the BLE peripheral.
 *
 * Triggers the provided callback when data is retrieved.
 *
 * @param {Number} serviceId ID of service to get details for
 * @param {Number} characteristicId ID of characteristic to get details for
 * @param {Function} callback
 * @publish
 */
Central.prototype.readServiceCharacteristic = function(serviceId, characteristicId, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    if (err) {
      return callback(err);
    }

    c.read(function(err, data) {
      callback(err, data);
    });
  });
};

/**
 * Writes a service characteristic value to the BLE peripheral.
 *
 * Triggers the provided callback when data is written.
 *
 * @param {Number} serviceId ID of service to get details for
 * @param {Number} characteristicId ID of characteristic to get details for
 * @param {Number} value value to write to the characteristic
 * @param {Function} callback
 * @publish
 */
Central.prototype.writeServiceCharacteristic = function(serviceId, characteristicId, value, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    c.write(value, false, function() {
      callback(null);
    });
  });
};

/**
 * Changes a service characteristic's notification state on the BLE peripheral.
 *
 * Triggers the provided callback when data is written.
 *
 * @param {Number} serviceId ID of service to get details for
 * @param {Number} characteristicId ID of characteristic to get details for
 * @param {String} state notify state to write
 * @param {Function} callback
 * @publish
 */
Central.prototype.notifyServiceCharacteristic = function(serviceId, characteristicId, state, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    c.notify(state, function(err) {
      c.on("read", function(data, isNotification) {
        callback(err, data, isNotification);
      });
    });
  });
};

/**
 * Finds a BLE service characteristic
 *
 * Triggers the provided callback when the characteristic is found
 *
 * @param {Number} serviceId ID of service to look for
 * @param {Number} characteristicId ID of characteristic to look for
 * @param {Function} callback
 * @publish
 */
Central.prototype.getCharacteristic = function(serviceId, characteristicId, callback) {
  if (!this.isConnected) {
    callback("Not connected", null);
    return;
  }

  var p = this.connectedPeripherals[this.uuid].peripheral;

  p.connect(function(){
    p.discoverServices([serviceId], function(serErr, services) {
      if (services.length > 0) {
        var s = services[0];

        s.discoverCharacteristics([characteristicId], function(charErr, characteristics) {
          var c = characteristics[0];
          callback(null, c);
        });
      } else {
        callback("Characteristic not found", null);
      }
    });
  });
};
