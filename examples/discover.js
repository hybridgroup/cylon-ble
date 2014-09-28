var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble', uuid: '207377654321'},
  devices: [{name: 'battery', driver: 'ble-battery-service'},
            {name: 'deviceInfo', driver: 'ble-device-information'},
            {name: 'generic', driver: 'ble-generic-access'},
            {name: 'wiced', driver: 'ble-wiced-sense'}],

  work: function(my) {
    my.generic.getDeviceName(function(err, data){
      console.log(data);
      my.deviceInfo.getManufacturerName(function(err, data){
        console.log(data);
        my.wiced.getData(function(err, data){
          if (err) {
            console.log("Error:", err);
          } else {
            console.log("Data:", data);
          }
        });
      });
    });
  }
}).start();
