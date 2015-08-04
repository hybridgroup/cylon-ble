"use strict";

var mod = lib("../");

var Central = lib("central");

var Drivers = {
  "ble-battery-service": lib("battery-service"),
  "ble-generic-access": lib("generic-access"),
  "ble-device-information": lib("device-information"),
  "ble-characteristic": lib("characteristic")
};

describe("Cylon.BLE", function() {
  describe("#adaptors", function() {
    it("is an array of supplied adaptors", function() {
      expect(mod.adaptors).to.be.eql(["ble", "central"]);
    });
  });

  describe("#drivers", function() {
    it("is an array of supplied drivers", function() {
      expect(mod.drivers).to.be.eql(
        ["ble-battery-service", "ble-generic-access",
         "ble-device-information", "ble-characteristic"]
      );
    });
  });

  describe("#driver", function() {
    var opts = {};

    Object.keys(Drivers).forEach(function(driver) {
      it("instantiates the " + driver + " driver", function() {
        var driverClass = Drivers[driver];
        opts.driver = driver;
        expect(mod.driver(opts)).to.be.an.instanceOf(driverClass);
      });
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Central", function() {
      expect(mod.adaptor()).to.be.instanceOf(Central);
    });
  });
});
