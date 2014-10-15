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

BLEGenericAccess.prototype.parseAppearance = function(data) {
  var val = data.readUInt16LE(0);
  switch (val) {
    case 0:
      return { value: 'Unknown', description: 'None' };

    case 64:
      return { value: 'Generic Phone', description: 'Generic category' };

    case 128:
      return { value: 'Generic Computer', description: 'Generic category' };

    case 192:
      return { value: 'Generic Watch', description: 'Generic category' };

    case 193:
      return { value: 'Watch: Sports Watch', description: 'Watch subtype' };

    case 256:
      return { value: 'Generic Clock ', description: 'Generic category' };

    case 320:
      return { value: 'Generic Display', description: 'Generic category' };

    case 384:
      return { value: 'Generic Remote Control', description: 'Generic category' };

    case 448:
      return { value: 'Generic Eye-glasses', description: 'Generic category' };

    case 512:
      return { value: 'Generic Tag', description: 'Generic category' };

    case 576:
      return { value: 'Generic Keyring', description: 'Generic category' };

    case 640:
      return { value: 'Generic Media Player', description: 'Generic category' };

    case 704:
      return { value: 'Generic Barcode Scanner', description: 'Generic category' };

    case 768:
      return { value: 'Generic Thermometer', description: 'Generic category' };

    case 769:
      return { value: 'Thermometer: Ear', description: 'Thermometer subtype' };

    case 832:
      return { value: 'Generic Heart rate Sensor', description: 'Generic category' };

    case 833:
      return { value: 'Heart Rate Sensor: Heart Rate Belt', description: 'Heart Rate Sensor subtype' };

    case 896:
      return { value: 'Generic Blood Pressure', description: 'Generic category' };

    case 897:
      return { value: 'Blood Pressure: Arm Blood', description: 'Pressure subtype' };

    case 898:
      return { value: 'Blood Pressure: Wrist Blood', description: 'Pressure subtype' };

    case 960:
      return { value: 'Human Interface Device (HID)', description: 'HID Generic' };

    case 961:
      return { value: 'Keyboard', description: 'HID subtype' };

    case 962:
      return { value: 'Mouse', description: 'HID subtype' };

    case 963:
      return { value: 'Joystick', description: 'HID subtype' };

    case 964:
      return { value: 'Gamepad', description: 'HID subtype' };

    case 965:
      return { value: 'Digitizer Tablet', description: 'HID subtype' };

    case 966:
      return { value: 'Card Reader', description: 'HID subtype' };

    case 967:
      return { value: 'Digital Pen', description: 'HID subtype' };

    case 968:
      return { value: 'Barcode Scanner', description: 'HID subtype' };

    case 1024:
      return { value: 'Generic Glucose Meter', description: 'Generic category' };

    case 1088:
      return { value: 'Generic: Running Walking Sensor', description: 'Generic category' };

    case 1089:
      return { value: 'Running Walking Sensor: In-Shoe', description: 'Running Walking Sensor subtype' };

    case 1090:
      return { value: 'Running Walking Sensor: On-Shoe', description: 'Running Walking Sensor subtype' };

    case 1091:
      return { value: 'Running Walking Sensor: On-Hip', description: 'Running Walking Sensor subtype' };

    case 1152:
      return { value: 'Generic: Cycling', description: 'Generic category' };

    case 1153:
      return { value: 'Cycling: Cycling Computer', description: 'Cycling subtype' };

    case 1154:
      return { value: 'Cycling: Speed Sensor', description: 'Cycling subtype' };

    case 1155:
      return { value: 'Cycling: Cadence Sensor', description: 'Cycling subtype' };

    case 1156:
      return { value: 'Cycling: Power Sensor', description: 'Cycling subtype' };

    case 1157:
      return { value: 'Cycling: Speed and Cadence Sensor', description: 'Cycling subtype' };

    case 3136:
      return { value: 'Generic: Pulse Oximeter', description: 'Pulse Oximeter Generic Category' };

    case 3137:
      return { value: 'Fingertip Pulse', description: 'Pulse Oximeter subtype' };

    case 3138:
      return { value: 'Wrist Worn', description: 'Pulse Oximeter subtype' };

    case 3200:
      return { value: 'Generic: Weight Scale', description: 'Weight Scale Generic Category' };

    case 5184:
      return { value: 'Generic: Outdoor Sports Activity', description: 'Outdoor Sports Activity Generic Category' };

    case 5185:
      return { value: 'Location Display Device', description: 'Outdoor Sports Activity subtype' };

    case 5186:
      return { value: 'Location and Navigation Display Device', description: 'Outdoor Sports Activity subtype' };

    case 5187:
      return { value: 'Location Pod', description: 'Outdoor Sports Activity subtype' };

    case 5188:
      return { value: 'Location and Navigation Pod', description: 'Outdoor Sports Activity subtype' };

    default:
      return { value: "Unknown value", description: 'Unknown' };
  }
};
