var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'central', uuid: '207377654321', module: 'ble' },
  device: { name: 'battery', driver: 'ble-battery-service' },

  display: function(err, data) {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Data:", data);
    }
  },

  work: function(my) {
    my.battery.getBatteryLevel(function(err, data){
      my.display(err, data);
    });
  }
}).start();
