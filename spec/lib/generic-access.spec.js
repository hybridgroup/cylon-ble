'use strict';

var BLEGenericAccess = source("generic-access");

var Cylon = require('cylon');

describe("Cylon.Drivers. BLE.BLEGenericAccess", function() {
  var driver;

  beforeEach(function() {
    driver = new BLEGenericAccess({
      connection: {}
    });
  });

  it("is a subclass of Cylon.Driver", function() {
    expect(driver).to.be.an.instanceOf(BLEGenericAccess);
    expect(driver).to.be.an.instanceOf(Cylon.Driver);
  });

  describe("#constructor", function() {
    it("sets @serviceId to the passed serviceId", function() {
      driver = new BLEGenericAccess({
        connection: {},
        serviceId: 'serviceId'
      });

      expect(driver.serviceId).to.be.eql('serviceId');
    });

    it("sets @serviceId to the '1800' by default", function() {
      expect(driver.serviceId).to.be.eql('1800');
    });
  });

  describe("#start", function() {
    it("triggers the callback", function() {
      var callback = spy();
      driver.start(callback);
      expect(callback).to.be.called;
    });
  });

  describe("#halt", function() {
    it("triggers the callback", function() {
      var callback = spy();
      driver.halt(callback);
      expect(callback).to.be.called;
    });
  });

  describe("#getDeviceName", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver._getServiceCharacteristic = stub().yields(null, 'value')
    });

    it("reads the service characteristic from the device", function() {
      driver.getDeviceName(callback);
      expect(driver._getServiceCharacteristic).to.be.calledWith("2a00");
      expect(callback).to.be.calledWith(null, 'value');
    });
  });

  describe("#getAppearance", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver._getServiceCharacteristic = stub().yields(null, 'value')
      driver.parseAppearance = stub().returns("parsed appearance")
    });

    it("reads the service characteristic from the device", function() {
      driver.getAppearance(callback);
      expect(driver._getServiceCharacteristic).to.be.calledWith("2a01");
      expect(driver.parseAppearance).to.be.calledWith('value');
      expect(callback).to.be.calledWith(null, "parsed appearance");
    });
  });

  describe("#parseAppearance", function() {
    var appearances = {
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
      '5188': { value: 'Location and Navigation Pod', description: 'Outdoor Sports Activity subtype' },
      'default': { value: "Unknown value", description: 'Unknown' }
    };

    Object.keys(appearances).map(function(code) {
      var appearance = appearances[code];

      it("returns " + appearance.value + " for the value " + code, function() {
        var data = { readUInt16LE: function() { return +code; } };
        expect(driver.parseAppearance(data)).to.be.eql(appearance);
      });
    });
  });

  describe("#_getServiceCharacteristic", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.readServiceCharacteristic = spy();
    });

    it("calls #readServiceCharacteristic on the connection", function() {
      driver._getServiceCharacteristic("hello", callback);
      expect(driver.connection.readServiceCharacteristic).to.be.calledWith(
        "1800",
        "hello",
        callback
      );
    });
  });
});
