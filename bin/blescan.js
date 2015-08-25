#!/usr/bin/env node

var noble = require('noble');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log("Starting scan.");
    noble.startScanning();
  } else {
    console.log("Stopping scan.");
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  console.log("Peripheral discovered!")
  console.log("  Name: " + peripheral.advertisement.localName)
  console.log("  UUID: " + peripheral.id);
  console.log("  rssi: " + peripheral.rssi);
});
