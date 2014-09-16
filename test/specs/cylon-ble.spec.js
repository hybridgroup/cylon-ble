"use strict";

var module = source("cylon-ble");

var Central = source('central'),
    BatteryService = source('battery-service'),
    DeviceInformation = source('device-information'),
    GenericAccess = source('generic-access')

describe("Cylon.BLE", function() {
  describe("#register", function() {
    it("should be a function", function() {
      expect(module.register).to.be.a('function');
    });
  });

  describe("#driver", function() {
    var opts = { device: {}, extraParams: {} };

    it("can instantiate a new BatteryService", function() {
      opts.name = 'battery-service';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(BatteryService);
    });

    it("can instantiate a new DeviceInformation", function() {
      opts.name = 'device-information';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(DeviceInformation);
    });

    it("can instantiate a new GenericAccess", function() {
      opts.name = 'generic-access';
      var driver = module.driver(opts);
      expect(driver).to.be.an.instanceOf(GenericAccess);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Central", function() {
      expect(module.adaptor()).to.be.instanceOf(Central);
    });
  });
});
