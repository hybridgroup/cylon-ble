"use strict";

var Cylon = require("cylon");

var Central = lib("central"),
    Noble = lib("noble");

describe("Central", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Central({
      uuid: "uuid"
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
    var ble, emit, callback;

    beforeEach(function() {
      ble = adaptor.bleConnect = {
        on: stub(),
        startScanning: stub(),
        stopScanning: stub()
      };

      emit = adaptor.emit = stub();

      callback = spy();

      adaptor.connect(callback);
    });

    it("registers a stateChange listener to start scanning", function() {
      expect(ble.on).to.be.calledWith("stateChange");
    });

    it("proxies the 'discover' event", function() {
      expect(ble.on).to.be.calledWith("discover");
      ble.on.withArgs("discover").yield("new device");
      expect(emit).to.be.calledWith("discover", "new device");
    });

    context("if a UUID was provided", function() {
      it("does not allow duplicates when scanning", function() {
        ble.on.withArgs("stateChange").yield("poweredOn");
        expect(ble.startScanning).to.be.calledWith([], false);
      });

      it("will connect to the specified peripheral", function() {
        var peripheral = { id: "uuid" };

        expect(callback).to.not.be.called;

        ble.on.withArgs("discover").yield(peripheral);

        it("adds the peripheral to #connectedPeripherals", function() {
          var p = { connected: false, peripheral: { id: "uuid" } };
          expect(adaptor.connectedPeripherals.uuid).to.be.eql(p);
          expect(ble.stopScanning).to.be.called;
        });

        expect(callback).to.be.called;
      });
    });

    context("if no UUID was provided", function() {
      beforeEach(function() {
        adaptor.uuid = null;
        adaptor.scanMode = true;
        adaptor.connect(callback);
      });

      it("allows duplicates when scanning", function() {
        ble.on.withArgs("stateChange").yield("poweredOn");
        expect(ble.startScanning).to.be.calledWith([], true);
      });

      it("triggers the callback immediately", function() {
        expect(callback).to.be.called;
      });

      it("doesn't try to connect to a peripheral", function() {
        ble.on.withArgs("discover").yield({ uuid: "uuid" });
        expect(ble.stopScanning).to.not.be.called;
        expect(adaptor.connectedPeripherals).to.be.eql({});
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
        uuid: { connected: false, peripheral: { uuid: "uuid" } }
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
      expect(characteristic.on).to.be.calledWith("data");

      expect(callback).to.be.calledWith(null, "data");
    });
  });

  describe("#getCharacteristic", function() {
    var callback, peripheral, service, characteristic;

    beforeEach(function() {
      callback = spy();
      adaptor.connectedPeripherals.uuid = {};

      characteristic = {
        uuid: "characteristicId"
      };

      service = {
        uuid: "serviceId",
        discoverCharacteristics: stub().yields(null, [characteristic]),
        characteristics: [characteristic]
      };

      peripheral = adaptor.connectedPeripherals.uuid.peripheral = {
        connect: stub().yields(),
        discoverServices: stub().yields(null, [service]),
        services: [service],
        state: "disconnected"
      };

      adaptor.connectedPeripheral = function() { return peripheral; };

      adaptor.connectedPeripherals.uuid.services = {};
    });

    context("when peripheral is connected", function() {
      beforeEach(function() {
        peripheral.state = "connected";
        adaptor._connectedServices = function() {
          return [service];
        };
        adaptor._connectedCharacteristics = function() {
          return [characteristic];
        };
        adaptor.getCharacteristic("serviceId", "characteristicId", callback);
      });

      it("triggers the callback with the cached characteristic", function() {
        expect(callback).to.be.calledWith(null, characteristic);
      });
    });

    context("when peripheral is not connected", function() {
      context("can get services", function() {
        beforeEach(function() {
          peripheral.state = "disconnected";
          adaptor._connectedCharacteristics = function() {
            return service.characteristics;
          };
          adaptor.getCharacteristic("serviceId", "characteristicId", callback);
        });

        it("connects to the peripheral", function() {
          expect(peripheral.connect).to.be.called;
        });

        it("discovers services through the peripheral", function() {
          expect(peripheral.discoverServices).to.be.calledWith(null);
        });
      });

      context("can get characteristics", function() {
        beforeEach(function() {
          peripheral.state = "disconnected";
          adaptor._connectedServices = function() { return [service]; };
          adaptor._connectedCharacteristics = function() { return null; };
          adaptor.getCharacteristic("serviceId", "characteristicId", callback);
        });

        it("connects to the peripheral", function() {
          expect(peripheral.connect).to.be.called;
        });

        it("discovers the service's characteristics", function() {
          expect(service.discoverCharacteristics).to.be.calledWith(null);
        });
      });
    });
  });
});
