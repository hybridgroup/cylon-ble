/*
 * cylon-ble GenericAccess driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Driver = require('./driver');

var GenericAccess = '1800',
    DeviceName = '2a00',
    Appearance = '2a01';

var BLEGenericAccess = module.exports = function BLEGenericAccess(opts) {
  BLEGenericAccess.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || GenericAccess;

  this.commands = {
    getDeviceName: this.getDeviceName,
    getAppearance: this.getAppearance
  };
};

Cylon.Utils.subclass(BLEGenericAccess, Driver);

BLEGenericAccess.prototype.getDeviceName = function(callback) {
  this._getServiceCharacteristic(DeviceName, function(err, data) {
    if (data !== null) {
      data = data.toString();
    }
    callback(err, data);
  });
};

BLEGenericAccess.prototype.getAppearance = function(callback) {
  var self = this;
  this._getServiceCharacteristic(Appearance, function(err, data) {
    if (data !== null) {
      data = self.parseAppearance(data);
    }
    callback(err, data);
  });
};

BLEGenericAccess.prototype.appearances = {
  '0': { value: 'Unknown', description: 'None' },
  '64': { value: 'Generic Phone', description: 'Generic category' },
  '128': { value: 'Generic Computer', description: 'Generic category' },
  '192': { value: 'Generic Watch', description: 'Generic category' },
  '193': { value: 'Watch: Sports Watch', description: 'Watch subtype' },
  '256': { value: 'Generic Clock ', description: 'Generic category' },
  '320': { value: 'Generic Display', description: 'Generic category' },
  '384': { value: 'Generic Remote Control', description: 'Generic category' },
  '448': { value: 'Generic Eye-glasses', description: 'Generic category' },
  '512': { value: 'Generic Tag', description: 'Generic category' },
  '576': { value: 'Generic Keyring', description: 'Generic category' },
  '640': { value: 'Generic Media Player', description: 'Generic category' },
  '704': { value: 'Generic Barcode Scanner', description: 'Generic category' },
  '768': { value: 'Generic Thermometer', description: 'Generic category' },
  '769': { value: 'Thermometer: Ear', description: 'Thermometer subtype' },
  '832': { value: 'Generic Heart rate Sensor', description: 'Generic category' },
  '833': { value: 'Heart Rate Sensor: Heart Rate Belt', description: 'Heart Rate Sensor subtype' },
  '896': { value: 'Generic Blood Pressure', description: 'Generic category' },
  '897': { value: 'Blood Pressure: Arm Blood', description: 'Pressure subtype' },
  '898': { value: 'Blood Pressure: Wrist Blood', description: 'Pressure subtype' },
  '960': { value: 'Human Interface Device (HID)', description: 'HID Generic' },
  '961': { value: 'Keyboard', description: 'HID subtype' },
  '962': { value: 'Mouse', description: 'HID subtype' },
  '963': { value: 'Joystick', description: 'HID subtype' },
  '964': { value: 'Gamepad', description: 'HID subtype' },
  '965': { value: 'Digitizer Tablet', description: 'HID subtype' },
  '966': { value: 'Card Reader', description: 'HID subtype' },
  '967': { value: 'Digital Pen', description: 'HID subtype' },
  '968': { value: 'Barcode Scanner', description: 'HID subtype' },
  '1024': { value: 'Generic Glucose Meter', description: 'Generic category' },
  '1088': { value: 'Generic: Running Walking Sensor', description: 'Generic category' },
  '1089': { value: 'Running Walking Sensor: In-Shoe', description: 'Running Walking Sensor subtype' },
  '1090': { value: 'Running Walking Sensor: On-Shoe', description: 'Running Walking Sensor subtype' },
  '1091': { value: 'Running Walking Sensor: On-Hip', description: 'Running Walking Sensor subtype' },
  '1152': { value: 'Generic: Cycling', description: 'Generic category' },
  '1153': { value: 'Cycling: Cycling Computer', description: 'Cycling subtype' },
  '1154': { value: 'Cycling: Speed Sensor', description: 'Cycling subtype' },
  '1155': { value: 'Cycling: Cadence Sensor', description: 'Cycling subtype' },
  '1156': { value: 'Cycling: Power Sensor', description: 'Cycling subtype' },
  '1157': { value: 'Cycling: Speed and Cadence Sensor', description: 'Cycling subtype' },
  '3136': { value: 'Generic: Pulse Oximeter', description: 'Pulse Oximeter Generic Category' },
  '3137': { value: 'Fingertip Pulse', description: 'Pulse Oximeter subtype' },
  '3138': { value: 'Wrist Worn', description: 'Pulse Oximeter subtype' },
  '3200': { value: 'Generic: Weight Scale', description: 'Weight Scale Generic Category' },
  '5184': { value: 'Generic: Outdoor Sports Activity', description: 'Outdoor Sports Activity Generic Category' },
  '5185': { value: 'Location Display Device', description: 'Outdoor Sports Activity subtype' },
  '5186': { value: 'Location and Navigation Display Device', description: 'Outdoor Sports Activity subtype' },
  '5187': { value: 'Location Pod', description: 'Outdoor Sports Activity subtype' },
  '5188': { value: 'Location and Navigation Pod', description: 'Outdoor Sports Activity subtype' }
};

BLEGenericAccess.prototype.parseAppearance = function(data) {
  var val = data.readUInt16LE(0),
      unknown = { value: "Unknown value", description: 'Unknown' };

  return this.appearances[val] || unknown;
};
