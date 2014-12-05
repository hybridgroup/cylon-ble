var Cylon = require('cylon');

Cylon.robot({
  connection: {
    bluetooth: { adaptor: 'central', uuid: '207377654321', module: 'cylon-ble' }
  },
  device: { name: 'generic', driver: 'ble-generic-access' },

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
    });
  }
}).start();
