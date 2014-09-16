var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble', uuid: '207377654321'},
  device: {name: 'generic', driver: 'generic-access'},

  work: function(my) {
    after((1).second(), function() {
      my.generic.getName(function(err, data){
        if (err) {
          console.log(err);
        } else {
          console.log(data.toString());
        }
      });
    });
  }
}).start();
