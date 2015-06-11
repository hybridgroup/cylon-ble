"use strict";

var Cylon = require("cylon");

var BLEBatteryService = lib("battery-service");

describe("Cylon.Drivers.BLE.BLEBatteryService", function() {
  var driver;

  beforeEach(function() {
    driver = new BLEBatteryService({
      connection: {}
    });
  });

  it("is a subclass of Cylon.Driver", function() {
    expect(driver).to.be.an.instanceOf(BLEBatteryService);
    expect(driver).to.be.an.instanceOf(Cylon.Driver);
  });

  describe("#constructor", function() {
    it("sets @serviceId to the passed serviceId", function() {
      driver = new BLEBatteryService({
        connection: {},
        serviceId: "serviceId"
      });

      expect(driver.serviceId).to.be.eql("serviceId");
    });

    it("sets @serviceId to the '180f' by default", function() {
      expect(driver.serviceId).to.be.eql("180f");
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

  describe("#getBatteryLevel", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver._getServiceCharacteristic = stub().yields(null, new Buffer("1"));
    });

    it("reads the service characteristic from the device", function() {
      driver.getBatteryLevel(callback);
      expect(driver._getServiceCharacteristic).to.be.calledWith("2a19");
      expect(callback).to.be.calledWith(null, 49);
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
        "180f",
        "hello",
        callback
      );
    });
  });
});
