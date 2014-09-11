"use strict";

var module = source("cylon-ble");

var Central = source('central'),
    Driver = source('driver');

describe("Cylon.BLE", function() {
  describe("#register", function() {
    it("should be a function", function() {
      expect(module.register).to.be.a('function');
    });
  });

  describe("#driver", function() {
    it("returns an instance of the Driver", function() {
      var args = { device: {} };
      expect(module.driver(args)).to.be.instanceOf(Driver);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Central", function() {
      expect(module.adaptor()).to.be.instanceOf(Central);
    });
  });
});
