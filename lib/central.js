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
  if (opts == null) {
    opts = {};
  }

  var extraParams = opts.extraParams || {};

  this.bleConnect = require('./noble');
  this.isConnected = false;
  this.uuid = extraParams.uuid ; // TODO: handle array of UUIDs
  this.connectedPeripherals = {};
  Central.__super__.constructor.apply(this, arguments);
};

Cylon.Utils.subclass(Central, Cylon.Adaptor);

Central.prototype.commands = ['startScanning', 'stopScanning', 'peripherals', 'getServiceCharacteristic', 'setServiceCharacteristicNotify'];

Central.prototype.connect = function(callback) {
  var self = this;

  this.bleConnect.on('discover', function(peripheral) {
    self.isConnected = true;
    if (peripheral.uuid === self.uuid) {
      var p = {peripheral: peripheral, connected: false};
      self.connectedPeripherals[peripheral.uuid] = p;
      self.bleConnect.stopScanning(); // TODO scan for list
      callback(null);
      self.connection.emit('connect');
    }
  });
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

Central.prototype.getServiceCharacteristic = function(serviceId, characteristicId, callback) {
  if (!this.isConnected) {
    callback("Not connected", null);
    return;
  }

  var p = this.connectedPeripherals[this.uuid].peripheral;

  p.connect(function(){
    p.discoverServices([serviceId], function(err, services) {
      if (services.length > 0) {
        var s = services[0];
        s.discoverCharacteristics([characteristicId], function(error, characteristics) {
          var c = characteristics[0];
          c.read(function(err, data) {
            callback(error, data);
          });
        });
      } else {
        callback("Characteristic not found", null);
      }
    });
  });
};

Central.prototype.setServiceCharacteristic = function(serviceId, characteristicId, value, callback) {
  if (!this.isConnected) {
    callback("Not connected", null);
    return;
  }

  var p = this.connectedPeripherals[this.uuid].peripheral;

  p.connect(function(){
    p.discoverServices([serviceId], function(err, services) {
      if (services.length > 0) {
        var s = services[0];

        s.discoverCharacteristics([characteristicId], function(error, characteristics) {
          var c = characteristics[0];

          c.write(value, function(err) {
            callback(err, characteristics);
          });
        });
      } else {
        callback("Characteristic not found", null);
      }
    });
  });
};

Central.prototype.setServiceCharacteristicNotify = function(serviceId, characteristicId, state, callback) {
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

          c.notify(state, function(err) {
            callback(err, characteristics);
          });
        });
      } else {
        callback("Characteristic not found", null);
      }
    });
  });
};
