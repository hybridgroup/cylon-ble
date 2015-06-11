"use strict";

var BLEGenericAccess = lib("generic-access");

var Cylon = require("cylon");

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
        serviceId: "serviceId"
      });

      expect(driver.serviceId).to.be.eql("serviceId");
    });

    it("sets @serviceId to the '1800' by default", function() {
      expect(driver.serviceId).to.be.eql("1800");
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
      driver._getServiceCharacteristic = stub().yields(null, "value");
    });

    it("reads the service characteristic from the device", function() {
      driver.getDeviceName(callback);
      expect(driver._getServiceCharacteristic).to.be.calledWith("2a00");
      expect(callback).to.be.calledWith(null, "value");
    });
  });

  describe("#getAppearance", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver._getServiceCharacteristic = stub().yields(null, "value");
      driver.parseAppearance = stub().returns("parsed appearance");
    });

    it("reads the service characteristic from the device", function() {
      driver.getAppearance(callback);
      expect(driver._getServiceCharacteristic).to.be.calledWith("2a01");
      expect(driver.parseAppearance).to.be.calledWith("value");
      expect(callback).to.be.calledWith(null, "parsed appearance");
    });
  });

  describe("#parseAppearance", function() {
    var appearances = require("./../support/appearances.json");

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
