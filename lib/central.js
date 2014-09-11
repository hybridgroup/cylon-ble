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

  this.bleConnect = require('noble');
  this.isConnected = false;
  this.peripherals = {};
  Central.__super__.constructor.apply(this, arguments);
};

Cylon.Utils.subclass(Central, Cylon.Adaptor);

// Include a list of commands that will be make availble to the connection;
// which means they will be used by the drivers.
Central.prototype.commands = ['startScanning', 'stopScanning'];

Central.prototype.connect = function(callback) {
  Central.__super__.connect.apply(this, arguments);

  this.isConnected = true;
  this.bleConnect.on('discover', function(peripheral) {
    this.peripherals[peripheral.advertisement.localName] = peripheral;
    console.log('peripheral discovered (' + peripheral.uuid+ '):');
    console.log('\thello my local name is:');
    console.log('\t\t' + peripheral.advertisement.localName);
    console.log('\tcan I interest you in any of the following advertised services:');
    console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));

    var serviceData = peripheral.advertisement.serviceData;
    if (serviceData && serviceData.length) {
      console.log('\there is my service data:');
      for (var i in serviceData) {
        console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
      }
    }
    if (peripheral.advertisement.manufacturerData) {
      console.log('\there is my manufacturer data:');
      console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
    }
    if (peripheral.advertisement.txPowerLevel !== undefined) {
      console.log('\tmy TX power level is:');
      console.log('\t\t' + peripheral.advertisement.txPowerLevel);
    }

    console.log();
  });
};

Central.prototype.startScanning = function() {
  this.bleConnect.startScanning();
};

Central.prototype.stopScanning = function() {
  this.bleConnect.stopScanning();
};

