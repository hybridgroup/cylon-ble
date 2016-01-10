# Cylon.js For Bluetooth LE

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things using Node.js

This repository contains the Cylon adaptor/drivers to connect to Bluetooth Low Energy (LE) peripherals. It uses the Noble node module (https://github.com/sandeepmistry/noble) created by [@sandeepmistry](https://github.com/sandeepmistry) thank you!

For more information about Cylon, check out the repo at
https://github.com/hybridgroup/cylon

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-ble.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-ble) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-ble/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-ble) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-ble/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-ble)

## How to Install

Install the module with:

    $ npm install cylon cylon-ble

For Ubuntu you must install the following dependency prior to `npm install cylon-ble`:

    $ sudo apt-get install libbluetooth-dev

## How to Use

Here's a basic BLE example to get the battery level of a device:

```javascript
"use strict";

var Cylon = require('cylon');

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'ble', uuid: '207377654321' }
  },

  devices: {
    battery: { driver: 'ble-battery-service' }
  },

  work: function(my) {
    my.battery.getBatteryLevel(function(err, data) {
      if (!!err) {
        console.log("Error: ", err);
        return;
      }

      console.log("Data: ", data);
    });
  }
}).start();
```

## How to Connect

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    wiced: { adaptor: 'ble', uuid: '207377654321' }
  },

  devices: {
    battery: { driver: 'ble-battery-service' }
  },

  work: function(my) {
    every((1).second(), function() {
      my.battery.getBatteryLevel(function(err, data){
        if (err) {
          console.log(err);
        } else {
          console.log("BatteryLevel:", data);
        }
      });
    });
  }
}).start();
```

You will need a computer with a hardware adaptor that supports Bluetooth LE, also known as Bluetooth 4.0, or Bluetooth Smart. Also, this module currently only supports OSX and Linux operating systems.

## Commands

You can use the `cylon-ble` modules's included commands to scan for BLE devices, and then to list the various BLE characteristics for a specific device.

Note that you need to install cylon-ble using the `-g` option, and then run each commands under `sudo` like this:

    $ sudo cylon-ble-scan
    Starting scan.
    Peripheral discovered!
      Name: 2B-785E
      UUID: cc360e85785e
      rssi: -80

    $ sudo cylon-ble-info cc360e85785e
    peripheral with UUID cc360e85785e found
      Local Name        = 2B-785E
      TX Power Level    = -10
      Service Data      =
      Service UUIDs     = 22bb746f2ba075542d6f726568705327

    services and characteristics:
    1800 (Generic Access)
      2a00 (Device Name)
        properties  read, write
        value       32422d37383545 | '2B-785E'
    ...


## Documentation

We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

For our contribution guidelines, please go to [https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
](https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
).

## Release History

For the release history, please go to [https://github.com/hybridgroup/cylon-gpio/blob/master/RELEASES.md
](https://github.com/hybridgroup/cylon-gpio/blob/master/RELEASES.md
).

## License

Copyright (c) 2014-2016 The Hybrid Group. Licensed under the Apache 2.0 license.
