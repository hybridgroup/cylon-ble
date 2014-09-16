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

  this.bleConnect = require('noble');
  this.isConnected = false;
  this.uuid = extraParams.uuid ; // TODO: handle array of UUIDs
  this.connectedPeripherals = {};
  Central.__super__.constructor.apply(this, arguments);
};

Cylon.Utils.subclass(Central, Cylon.Adaptor);

Central.prototype.commands = ['startScanning', 'stopScanning', 'peripherals', 'getServiceCharacteristic'];

Central.prototype.connect = function(callback) {
  Central.__super__.connect.apply(this, arguments);
  var self = this;

  this.bleConnect.on('discover', function(peripheral) {
    self.isConnected = true;
    if (peripheral.uuid === self.uuid) {
      var p = {peripheral: peripheral, connected: false}
      self.connectedPeripherals[peripheral.uuid] = p;
      self.bleConnect.stopScanning(); // TODO scan for list
    }
  });
  this.bleConnect.startScanning();
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

Central.prototype.getServiceCharacteristic = function(serviceId, characteristicId, cb) {
  if (!this.isConnected) {cb("Not connected", null); return;}

  var p = this.connectedPeripherals[this.uuid].peripheral;
  p.connect(function(err){
    p.discoverServices([serviceId], function(error, services) {
      if (services.length > 0) {
        var s = services[0];
        s.discoverCharacteristics([characteristicId], function(error, characteristics) {
          var c = characteristics[0];
          c.read(function(error, data) {
            cb(error, data);
          });
        });
      } else {
        cb("Characteristic not found", null);
      }
    });
  });
};
