"use strict";

var Cylon = require("cylon");

var BLECharacteristic = lib("characteristic");

describe("Cylon.Drivers.BLE.BLECharacteristic", function() {
  var driver;

  beforeEach(function() {
    driver = new BLECharacteristic({
      connection: {}
    });
  });

  it("is a subclass of Cylon.Driver", function() {
    expect(driver).to.be.an.instanceOf(BLECharacteristic);
    expect(driver).to.be.an.instanceOf(Cylon.Driver);
  });

  describe("#constructor", function() {
    it("sets @serviceId to the passed serviceId", function() {
      driver = new BLECharacteristic({
        connection: {},
        serviceId: "serviceId"
      });

      expect(driver.serviceId).to.be.eql("serviceId");
    });

    it("sets @characteristicId to the passed characteristicId", function() {
      driver = new BLECharacteristic({
        connection: {},
        characteristicId: "characteristicId"
      });

      expect(driver.characteristicId).to.be.eql("characteristicId");
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
});
