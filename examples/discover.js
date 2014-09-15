var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble', uuid: '207377654321'},
  device: {name: 'led', driver: 'ping'},

  work: function(my) {
    after((10).second(), function() {console.log(my.bluetooth.peripherals());});
  }
}).start();
