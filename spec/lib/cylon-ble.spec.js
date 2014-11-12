"use strict";

var module = source("cylon-ble");

var Central = source('central');

var Drivers = {
  'ble-battery-service': source('battery-service'),
  'ble-generic-access': source('generic-access'),
  'ble-device-information': source('device-information')
};

describe("Cylon.BLE", function() {
  describe("#adaptors", function() {
    it('is an array of supplied adaptors', function() {
      expect(module.adaptors).to.be.eql(['central']);
    });
  });

  describe("#drivers", function() {
    it('is an array of supplied drivers', function() {
      expect(module.drivers).to.be.eql(['ble-battery-service', 'ble-generic-access', 'ble-device-information']);
    });
  });

  describe("#driver", function() {
    var opts = {};

    for (var driver in Drivers) {
      var driverClass = Drivers[driver];
      opts.driver = driver;

      it("instantiates the " + driver + " driver", function() {
        expect(module.driver(opts)).to.be.an.instanceOf(driverClass);
      });
    }
  });

  describe("#adaptor", function() {
    it("returns an instance of the Central", function() {
      expect(module.adaptor()).to.be.instanceOf(Central);
    });
  });
});
