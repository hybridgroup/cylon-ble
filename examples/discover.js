var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble', uuid: '207377654321'},
  devices: [{name: 'battery', driver: 'ble-battery-service'},
            {name: 'deviceInfo', driver: 'ble-device-information'},
            {name: 'generic', driver: 'ble-generic-access'}],

  work: function(my) {
    my.generic.getDeviceName(function(err, data){
      console.log(data);
      my.deviceInfo.getManufacturerName(function(err, data){
        console.log(data);
      });
    });

    every((3).seconds(), function() {
      my.battery.getBatteryLevel(function(err, data){
        console.log("Battery:", data);
      });
    });
  }
}).start();
