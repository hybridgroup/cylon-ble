/*
 * cylon-ble adaptor for centrals
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Central = module.exports = function Central(opts) {
  opts = opts || {};
  var extraParams = opts.extraParams || {};

  Central.__super__.constructor.apply(this, arguments);

  this.bleConnect = require('./noble');
  this.isConnected = false;
  this.uuid = extraParams.uuid ; // TODO: handle array of UUIDs
  this.connectedPeripherals = {};
};

Cylon.Utils.subclass(Central, Cylon.Adaptor);

Central.prototype.connect = function(callback) {
  this.bleConnect.on('discover', function(peripheral) {
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

Central.prototype.disconnect = function(callback) {
  callback();
};

Central.prototype.startScanning = function() {
  this.bleConnect.startScanning();
};

Central.prototype.stopScanning = function() {
  this.bleConnect.stopScanning();
};

Central.prototype.peripherals = function() {
  return this.connectedPeripherals;
};

Central.prototype.readServiceCharacteristic = function(serviceId, characteristicId, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    c.read(function(err, data) {
      callback(err, data);
    });
  });
};

Central.prototype.writeServiceCharacteristic = function(serviceId, characteristicId, value, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    c.write(value, true, function(err) {
      callback(err, null);
    });
  });
};

Central.prototype.notifyServiceCharacteristic = function(serviceId, characteristicId, state, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    c.notify(state, function(err) {
      c.on('read', function(data, isNotification) {
        callback(err, data);
      });
    });
  });
};

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
