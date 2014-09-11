var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble'},
  device: {name: 'led', driver: 'ping'},

  work: function(my) {
    every((1).second(), console.log("alive"));
  }
}).start();
