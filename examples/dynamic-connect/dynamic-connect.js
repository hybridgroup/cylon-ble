"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: "central", module: __dirname + "/../../" }
  },

  connectBLE: function(peripheral) {
    if (this.connected) { return; }

    this.bluetooth.connectPeripheral(peripheral.uuid, peripheral, function() {
      console.log(peripheral.advertisement.localName, peripheral.uuid);
      this.connected = true;
      this.device("blething",
                  {connection: "bluetooth", driver: "ble-device-information"});
      this.startDevice(this.devices.blething, function() {
        this.devices.blething.getManufacturerName(function(err, data) {
          if (err) {
            console.log("error: ", err);
            return;
          }
          console.log("data: ", data);
        });
      }.bind(this));
    }.bind(this));
  },

  work: function(my) {
    this.connected = false;

    my.bluetooth.on("discover", function(peripheral) {
      my.connectBLE(peripheral);
    });
  }
}).start();
