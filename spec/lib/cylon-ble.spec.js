/* jshint expr:true */
"use strict";

var mod = source("cylon-ble");

var Central = source("central");

var Drivers = {
  "ble-battery-service": source("battery-service"),
  "ble-generic-access": source("generic-access"),
  "ble-device-information": source("device-information")
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
        ["ble-battery-service", "ble-generic-access", "ble-device-information"]
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
