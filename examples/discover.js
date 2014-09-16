var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble', uuid: '207377654321'},
  device: {name: 'generic', driver: 'generic', serviceId: '1800', characteristicId: '2a00'},

  work: function(my) {
    after((1).second(), function() {
    	my.generic.getServiceCharacteristic(function(err, data){
    		if (err) {
    			console.log(err);
    		} else {
    			console.log(data.toString());
    		}
    	});
    });
  }
}).start();
