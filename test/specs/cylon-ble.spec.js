"use strict";

var module = source("cylon-ble");

var Central = source('central');

var Drivers = {
  'ble-battery-service': source('battery-service'),
  'ble-generic-access': source('generic-access'),
  'ble-device-information': source('device-information')
};

describe("Cylon.BLE", function() {
  describe("#register", function() {
    var bot;

    beforeEach(function() {
      bot = { registerDriver: spy(), registerAdaptor: spy() };
      module.register(bot);
    });

    it("should register the drivers with the Robot", function() {
      for (var driver in Drivers) {
        expect(bot.registerDriver).to.be.calledWith("cylon-ble", driver);
      };
    });

    it("should register the 'central' adaptor with the Robot", function() {
      expect(bot.registerAdaptor).to.be.calledWith("cylon-ble", 'central');
    });
  });

  describe("#driver", function() {
    var opts = { device: { connection: 'test' }, extraParams: {} };

    it("instantiates BLE drivers", function() {
      for (var driver in Drivers) {
        var driverClass = Drivers[driver];
        opts.name = driver;

        expect(module.driver(opts)).to.be.an.instanceOf(driverClass);
      }
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Central", function() {
      expect(module.adaptor()).to.be.instanceOf(Central);
    });
  });
});
