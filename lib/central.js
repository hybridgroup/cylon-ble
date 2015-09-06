/*
 * cylon-ble adaptor for centrals
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint max-len: 0 */

"use strict";

var Cylon = require("cylon");

var UUIDS = [];

var Central = module.exports = function Central(opts) {
  opts = opts || {};

  Central.__super__.constructor.apply(this, arguments);

  this.bleConnect = require("./noble");
  this.isConnected = false;
  this.uuid = opts.uuid; // TODO: handle array of UUIDs
  this.writeNotify = opts.writeNotify || true;
  this.connectedPeripherals = {};
};

Cylon.Utils.subclass(Central, Cylon.Adaptor);

/**
 * Connects to the BLE peripheral
 *
 * @param {Function} callback to be triggered when connected
 * @return {void}
 */
Central.prototype.connect = function(callback) {
  var ble = this.bleConnect;

  // no UUID provided, we'll scan for peripherals but not connect to them
  var scanMode = (this.uuid == null);

  ble.on("stateChange", function(state) {
    if (state === "poweredOn") {
      return ble.startScanning([], scanMode);
    }

    ble.stopScanning();
  });

  ble.on("discover", this.emit.bind(this, "discover"));

  if (scanMode) {
    callback(null);
    return;
  }

  UUIDS.push(this.uuid);

  ble.on("discover", function(peripheral) {
    if (peripheral.id === this.uuid) {
      this.connectPeripheral(this.uuid, peripheral, callback);
    }
  }.bind(this));
};

/**
 * Disconnects from the BLE peripheral
 *
 * @param {Function} callback to be triggered when disconnected
 * @return {void}
 */
Central.prototype.disconnect = function(callback) {
  callback();
};

/**
 * Tells the BLE adaptor to start scanning for peripherals
 *
 * @return {void}
 * @publish
 */
Central.prototype.startScanning = function() {
  this.bleConnect.startScanning();
};

/**
 * Tells the BLE adaptor to stop scanning for peripherals
 *
 * @return {void}
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
 * Connects to a specific peripheral
 *
 * @param {String} uuid of the BLE peripheral to connect to
 * @param {Object} peripheral to connect to
 * @param {Function} callback to be triggered when connected
 * @return {void}
 * @publish
 */
Central.prototype.connectPeripheral = function(uuid, peripheral, callback) {
  var idx = UUIDS.indexOf(uuid),
      p = { peripheral: peripheral, connected: false };

  this.uuid = uuid;
  this.connectedPeripherals[uuid] = p;

  if (~idx) { UUIDS.splice(idx, 1); }
  if (!UUIDS.length) { this.stopScanning(); }

  this.isConnected = true;
  callback(null);
};

/**
 * Reads a service characteristic from the BLE peripheral.
 *
 * Triggers the provided callback when data is retrieved.
 *
 * @param {Number} serviceId ID of service to get details for
 * @param {Number} characteristicId ID of characteristic to get details for
 * @param {Function} callback function to be invoked with value
 * @return {void}
 * @publish
 */
Central.prototype.readServiceCharacteristic = function(serviceId, characteristicId, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    if (err) {
      return callback(err);
    }

    c.read(callback);
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
 * @param {Function} callback function to be invoked when data is written
 * @return {void}
 * @publish
 */
Central.prototype.writeServiceCharacteristic = function(serviceId, characteristicId, value, callback) {
  var self = this;
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    if (err) { return callback(err); }

    c.write(value, self.writeNotify, function() {
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
 * @param {Function} callback function to be invoked when data is written
 * @return {void}
 * @publish
 */
Central.prototype.notifyServiceCharacteristic = function(serviceId, characteristicId, state, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    if (err) { return callback(err); }
    c.notify(state, function(error) {
      c.on("read", function(data, isNotification) {
        callback(error, data, isNotification);
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
 * @param {Function} callback function to be invoked with requested
 * characteristic
 * @return {void}
 * @publish
 */
Central.prototype.getCharacteristic = function(serviceId, characteristicId, callback) {
  if (!this.isConnected) {
    callback("Not connected", null);
    return;
  }

  var p = this.connectedPeripherals[this.uuid].peripheral;

  p.connect(function() {
    p.discoverServices([serviceId], function(serErr, services) {
      if (serErr) { return callback(serErr); }

      if (services.length > 0) {
        var s = services[0];

        s.discoverCharacteristics([characteristicId], function(charErr, characteristics) {
          if (charErr) { return callback(charErr); }

          var c = characteristics[0];
          callback(null, c);
        });
      } else {
        callback("Service not found", null);
      }
    });
  });
};
