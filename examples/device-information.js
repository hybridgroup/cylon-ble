var Cylon = require('cylon');

Cylon.robot({
  connection: {
    bluetooth: { adaptor: 'central', uuid: '207377654321', module: 'cylon-ble' }
  },
  device: { name: 'deviceInfo', driver: 'ble-device-information' },

  display: function(err, data) {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Data:", data);
    }
  },

  work: function(my) {
    my.deviceInfo.getManufacturerName(function(err, data){
      my.display(err, data);
    });
  }
}).start();
