/*
 * cylon-ble adaptor for centrals
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2015 The Hybrid Group
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
      p = { peripheral: peripheral, connected: false, services: {}, characteristics: {} };

  this.uuid = uuid;
  this.connectedPeripherals[uuid] = p;

  if (~idx) { UUIDS.splice(idx, 1); }
  if (!UUIDS.length) { this.stopScanning(); }

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
  var self = this;
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    if (err) { return callback(err); }
    c.on("data", function(data, isNotification) {
      callback(null, data, isNotification);
    });
    c.notify(state, function(err) {
      if (err) { return callback(err); }
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
  var self = this;

  this._connectBLE(function() {
    self._connectService(serviceId, function(err, s) {
      self._connectCharacteristic(serviceId, characteristicId, function(err, c) {
        callback(null, c);
      });
    });
  });
}

Central.prototype._connectBLE = function(callback) {
  if (this.isConnected) {
    callback();
  } else {
    var p = this._connectedPeripheral();
    var self = this;
    p.connect(function(){
      self.isConnected = true;
      callback();
    });
  }
}

Central.prototype._connectService = function(serviceId, callback) {
  if (!this.isConnected) {
    callback("Not connected", null);
    return;
  }

  var self = this;
  var p = this._connectedPeripheral();

  if (Object.keys(this._connectedServices()).length > 0) {
    callback(null, self._connectedService(serviceId));
  } else {
    p.discoverServices(null, function(serErr, services) {
      if (serErr) { return callback(serErr); }

      if (services.length > 0) {
        for (var s in services) {
          self._addConnectedService(services[s]);
        }

        var service = self._connectedService(serviceId);
        callback(null, service);
      } else {
        callback("No services found", null);
      }
    });
  }
}

Central.prototype._connectCharacteristic = function(serviceId, characteristicId, callback) {
  if (!this.isConnected) {
    callback("Not connected", null);
    return;
  }

  var self = this;
  if (Object.keys(self._connectedCharacteristics(serviceId)).length > 0) {
    callback(null, self._connectedCharacteristic(serviceId, characteristicId))
  } else {
    var s = self._connectedService(serviceId);

    s.discoverCharacteristics(null, function(charErr, characteristics) {
      if (charErr) { return callback(charErr); }

      if (characteristics.length > 0) {
        for (var c in characteristics) {
          self._addConnectedCharacteristic(serviceId, characteristics[c]);
        }

        var characteristic = self._connectedCharacteristic(serviceId, characteristicId);
        callback(null, characteristic);
      } else {
        callback("No characteristics found", null);
      }
    });
  }
}

// peripherals helpers
Central.prototype._connectedPeripheral = function() {
  return this.connectedPeripherals[this.uuid].peripheral;
}

// services helpers
Central.prototype._connectedServices = function() {
  if (!this.isConnected) {
    return null;
  }

  return this.connectedPeripherals[this.uuid].services;
}

Central.prototype._connectedService = function(serviceId) {
  return this._connectedServices()[serviceId].service;
}

Central.prototype._addConnectedService = function(service) {
  this._connectedServices()[service.uuid] = {service: service, characteristics: {}};
}

// characteristics helpers
Central.prototype._connectedCharacteristics = function(serviceId) {
  if (!this.isConnected) {
    return null;
  }

  return this._connectedServices()[serviceId].characteristics;
}

Central.prototype._addConnectedCharacteristic = function(serviceId, characteristic) {
  this._connectedCharacteristics(serviceId)[characteristic.uuid] = characteristic;
}

Central.prototype._connectedCharacteristic = function(serviceId, characteristicId) {
  return this._connectedCharacteristics(serviceId)[characteristicId];
}
