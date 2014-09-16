var Cylon = require('cylon');
var Async = require('async');

Cylon.robot({
  connection: { name: 'bluetooth', adaptor: 'ble', uuid: '207377654321'},
  devices: [{name: 'battery', driver: 'ble-battery-service'},
            {name: 'deviceInfo', driver: 'ble-device-information'},
            {name: 'generic', driver: 'ble-generic-access'}],

  work: function(my) {
    after((1).second(), function() {
      Async.series([
        function(callback) {
          my.generic.getDeviceName(function(err, data){
            callback(err, data);
          });
        },

        function(callback) {
          my.deviceInfo.getManufacturerName(function(err, data){
            callback(err, data);
          });
        },

        function(callback) {
          my.battery.getBatteryLevel(function(err, data){
            callback(err, data);
          });
        }
      ],

      function(err, data){
        console.log(data.toString());
      });
    });
  }
}).start();
