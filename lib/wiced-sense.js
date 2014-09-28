/*
 * cylon-ble WICED sense driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var BIT_ACCELEROMETER = 1;
var BIT_GYROSCOPE = 2;
var BIT_HUMIDITY = 4;
var BIT_MAGNETOMETER = 8;
var BIT_PRESSURE = 16;
var BIT_TEMPERATURE = 32;

var WICEDSense = module.exports = function WICEDSense(opts) {
  WICEDSense.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || '739298b687b64984a5dcbdc18b068985';

  this.commands = {
    getData: this.getData
  };
};

Cylon.Utils.subclass(WICEDSense, Cylon.Driver);

WICEDSense.prototype.start = function(callback) {
  callback();
};

WICEDSense.prototype.getData = function(callback) {
  var self = this;
  this.connection.notifyServiceCharacteristic(this.serviceId, '33ef91133b55413eb553fea1eaada459', true,
    function(err, data) {
      if (data !== null) {
        data = self._parseData(data);
      }

      callback(err, data);
    }
  );
};

WICEDSense.prototype._parseData = function(data) {
  var bitMask = data[0],
      result = {}, pos = 1,
      x, y, z;

  if (bitMask & BIT_ACCELEROMETER) {
    x = data.readInt16LE(pos);
    pos += 2;
    y = data.readInt16LE(pos);
    pos += 2;
    z = data.readInt16LE(pos);
    pos += 2;

    result['accelerometer'] = {x: x, y: y, z: z};
  }

  if (bitMask & BIT_GYROSCOPE) {
    x = data.readInt16LE(pos);
    pos += 2;
    y = data.readInt16LE(pos);
    pos += 2;
    z = data.readInt16LE(pos);
    pos += 2;

    result['gyroscope'] = {x: x, y: y, z: z};
  }

  if (bitMask & BIT_HUMIDITY) {
    var humidity = data.readInt16LE(pos);
    pos += 2;

    result['humidity'] = humidity;
  }

  if (bitMask & BIT_MAGNETOMETER) {
    x = data.readInt16LE(pos);
    pos += 2;
    y = data.readInt16LE(pos);
    pos += 2;
    z = data.readInt16LE(pos);
    pos += 2;

    result['magnetometer'] = {x: x, y: y, z: z};
  }

  if (bitMask & BIT_PRESSURE) {
    var pressure = data.readInt16LE(pos);
    pos += 2;

    result['pressure'] = pressure;
  }

  if (bitMask & BIT_TEMPERATURE) {
    var temperature = data.readInt16LE(pos);
    pos += 2;

    result['temperature'] = temperature;
  }

  return result;
};

WICEDSense.prototype._getServiceCharacteristic = function(characteristicId, callback) {
  this.connection.readServiceCharacteristic(this.serviceId, characteristicId, callback);
};
