/* jshint expr:true */
"use strict";

var Cylon = require("cylon");

var Central = source("central"),
    Noble = source("noble");

describe("Central", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Central({
      uuid: "uuid",
    });
  });

  it("is a subclass of Cylon.Adaptor", function() {
    expect(adaptor).to.be.an.instanceOf(Central);
    expect(adaptor).to.be.an.instanceOf(Cylon.Adaptor);
  });

  describe("#constructor", function() {
    it("sets @bleConnect to Noble", function() {
      expect(adaptor.bleConnect).to.be.eql(Noble);
    });

    it("sets @isConnected to false", function() {
      expect(adaptor.isConnected).to.be.eql(false);
    });

    it("sets @uuid to the provided UUID", function() {
      expect(adaptor.uuid).to.be.eql("uuid");
    });

    it("sets @connectedPeripherals to an empty object by default", function() {
      expect(adaptor.connectedPeripherals).to.be.eql({});
    });
  });

  describe("#connect", function() {
    var peripheral, bleConnect, callback;

    beforeEach(function() {
      callback = spy();

      peripheral = { uuid: "uuid" };

      bleConnect = adaptor.bleConnect = {
        on: stub(),
        startScanning: spy(),
        stopScanning: spy()
      };

      adaptor.connect(callback);
    });

    it("starts scanning for peripherals", function() {
      expect(bleConnect.startScanning).to.be.called;
    });

    context("when a peripheral is discovered", function() {
      context("if it's not the requested peripheral", function() {
        beforeEach(function() {
          peripheral.uuid = "nope";
          bleConnect.on.yield(peripheral);
        });

        it("keeps scanning", function() {
          expect(bleConnect.stopScanning).to.not.be.called;
        });

        it("doesn't trigger the callback", function() {
          expect(callback).to.not.be.called;
        });
      });

      context("if it is the requested peripheral", function() {
        beforeEach(function() {
          bleConnect.on.yield(peripheral);
        });

        it("stops scanning", function() {
          expect(bleConnect.stopScanning).to.be.called;
        });

        it("sets #isConnected to true", function() {
          expect(adaptor.isConnected).to.be.true;
        });

        it("adds the peripheral to #connectedPeripherals", function() {
          var p = { "connected": false, "peripheral": { "uuid": "uuid" } };
          expect(adaptor.connectedPeripherals.uuid).to.be.eql(p);
        });

        it("triggers the callback", function() {
          expect(callback).to.be.called;
        });
      });
    });
  });

  describe("#disconnect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      adaptor.disconnect(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.called;
    });
  });

  describe("#startScanning", function() {
    var bleConnect;

    beforeEach(function() {
      bleConnect = adaptor.bleConnect = { startScanning: spy() };
    });

    it("proxies to bleConnect#startScanning", function() {
      adaptor.startScanning();
      expect(bleConnect.startScanning).to.be.called;
    });
  });

  describe("#stopScanning", function() {
    var bleConnect;

    beforeEach(function() {
      bleConnect = adaptor.bleConnect = { stopScanning: spy() };
    });

    it("proxies to bleConnect#stopScanning", function() {
      adaptor.stopScanning();
      expect(bleConnect.stopScanning).to.be.called;
    });
  });

  describe("#peripherals", function() {
    beforeEach(function() {
      adaptor.connectedPeripherals = {
        uuid: { "connected": false, "peripheral": { "uuid": "uuid" } }
      };
    });

    it("returns the connectedPeripherals", function() {
      expect(adaptor.peripherals()).to.be.eql(adaptor.connectedPeripherals);
    });
  });

  describe("#readServiceCharacteristic", function() {
    var callback, characteristic;

    beforeEach(function() {
      characteristic = { read: stub().yields(null, "char data") };
      callback = spy();

      adaptor.getCharacteristic = stub().yields(null, characteristic);
    });

    it("fetches the characteristic, and reads data from it", function() {
      adaptor.readServiceCharacteristic(
        "serviceId",
        "characteristicId",
        callback
      );

      expect(adaptor.getCharacteristic).to.be.calledWith(
        "serviceId",
        "characteristicId"
      );

      expect(characteristic.read).to.be.called;
      expect(callback).to.be.calledWith(null, "char data");
    });
  });

  describe("#writeServiceCharacteristic", function() {
    var callback, characteristic;

    beforeEach(function() {
      characteristic = { write: stub().yields(null) };
      callback = spy();

      adaptor.getCharacteristic = stub().yields(null, characteristic);
    });

    it("fetches the characteristic, and writes data to it", function() {
      adaptor.writeServiceCharacteristic(
        "serviceId",
        "characteristicId",
        "value",
        callback
      );

      expect(adaptor.getCharacteristic).to.be.calledWith(
        "serviceId",
        "characteristicId"
      );

      expect(characteristic.write).to.be.calledWith("value");
      expect(callback).to.be.calledWith(null);
    });
  });

  describe("#notifyServiceCharacteristic", function() {
    var callback, characteristic;

    beforeEach(function() {
      characteristic = {
        notify: stub().yields(null),
        on: stub().yields("data", "isNotification")
      };

      callback = spy();

      adaptor.getCharacteristic = stub().yields(null, characteristic);
    });

    it("fetches the characteristic, and notifys it", function() {
      adaptor.notifyServiceCharacteristic(
        "serviceId",
        "characteristicId",
        "state", callback
      );

      expect(adaptor.getCharacteristic).to.be.calledWith(
        "serviceId",
        "characteristicId"
      );

      expect(characteristic.notify).to.be.calledWith("state");
      expect(characteristic.on).to.be.calledWith("read");

      expect(callback).to.be.calledWith(null, "data");
    });
  });

  describe("#getCharacteristic", function() {
    var callback, peripheral, service, characteristic;

    beforeEach(function() {
      callback = spy();
      adaptor.connectedPeripherals.uuid = {};

      characteristic = {};

      service = {
        discoverCharacteristics: stub().yields(null, [characteristic])
      };

      peripheral = adaptor.connectedPeripherals.uuid.peripheral = {
        connect: stub().yields(),
        discoverServices: stub().yields(null, [service])
      };
    });

    context("if #isConnected is false", function() {
      beforeEach(function() {
        adaptor.isConnected = false;
      });

      it("triggers the callback with an error", function() {
        adaptor.getCharacteristic("serviceId", "characteristicId", callback);
        expect(callback).to.be.calledWith("Not connected", null);
      });
    });

    context("if #isConnected is true", function() {
      beforeEach(function() {
        adaptor.isConnected = true;
        adaptor.getCharacteristic("serviceId", "characteristicId", callback);
      });

      it("connects to the peripheral", function() {
        expect(peripheral.connect).to.be.called;
      });

      it("discovers serivces through the peripheral", function() {
        expect(peripheral.discoverServices).to.be.calledWith(["serviceId"]);
      });

      it("discovers the service's characteristics", function() {
        expect(service.discoverCharacteristics).to.be.calledWith(
          ["characteristicId"]
        );
      });

      it("triggers the callback with the characteristic", function() {
        expect(callback).to.be.calledWith(null, characteristic);
      });
    });
  });
});
