var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble', uuid: '207377654321'},
  devices: [{name: 'battery', driver: 'battery-service'},
            {name: 'deviceInfo', driver: 'device-information'},
            {name: 'generic', driver: 'generic-access'}],

  work: function(my) {
    after((1).second(), function() {
      // my.generic.getDeviceName(function(err, data){
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log("Name:", data.toString());
      //   }
      // });

      // my.deviceInfo.getManufacturerName(function(err, data){
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log("ManufacturerName:", data.toString());
      //   }
      // });

      my.battery.getBatteryLevel(function(err, data){
        if (err) {
          console.log(err);
        } else {
          console.log("BatteryLevel:", data);
        }
      });
    });
  }
}).start();
