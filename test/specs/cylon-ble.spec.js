"use strict";

var module = source("cylon-ble");

var Central = source('central'),
    BLEBatteryService = source('battery-service'),
    BLEDeviceInformation = source('device-information'),
    BLEGenericAccess = source('generic-access')

describe("Cylon.BLE", function() {
  describe("#register", function() {
    it("should be a function", function() {
      expect(module.register).to.be.a('function');
    });
  });

  describe("#driver", function() {
    var opts = { device: {connection: 'test'}, extraParams: {} };

    it("can instantiate a new BLEBatteryService", function() {
      opts.name = 'ble-battery-service';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(BLEBatteryService);
    });

    it("can instantiate a new BLEDeviceInformation", function() {
      opts.name = 'ble-device-information';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(BLEDeviceInformation);
    });

    it("can instantiate a new BLEGenericAccess", function() {
      opts.name = 'ble-generic-access';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(BLEGenericAccess);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Central", function() {
      expect(module.adaptor()).to.be.instanceOf(Central);
    });
  });
});
