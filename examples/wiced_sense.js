var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble', uuid: '207377654321'},
  devices: [{name: 'battery', driver: 'ble-battery-service'},
            {name: 'deviceInfo', driver: 'ble-device-information'},
            {name: 'generic', driver: 'ble-generic-access'},
            {name: 'wiced', driver: 'ble-wiced-sense'}],

  display: function(err, data) {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Data:", data);
    }
  },

  work: function(my) {
    my.generic.getDeviceName(function(err, data){
      my.display(err, data);
      my.generic.getAppearance(function(err, data){
        my.display(err, data);
        my.deviceInfo.getManufacturerName(function(err, data){
          my.display(err, data);
          my.wiced.getData(function(err, data){
            my.display(err, data);
          });
        });
      });
    });
  }
}).start();
