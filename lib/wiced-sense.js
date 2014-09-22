/*
 * cylon-ble WICED sense driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var WICEDSense = module.exports = function WICEDSense(opts) {
  WICEDSense.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};
  this.serviceId = extraParams.serviceId || '739298b687b64984a5dcbdc18b068985';

  this.commands = {
    getData: this.getData
  };
};

Cylon.Utils.subclass(WICEDSense, Cylon.Driver);

WICEDSense.prototype.start = function(callback) {
  WICEDSense.__super__.start.apply(this, arguments);
};

WICEDSense.prototype.getData = function(cb) {
  this.connection.setServiceCharacteristicNotify(this.serviceId, '33ef91133b55413eb553fea1eaada459', true, 
    function(err) { 
      console.log(err);
    }
  );

  this._getServiceCharacteristic('33ef91133b55413eb553fea1eaada459', 
    function(err, data) {
  	// if (data !== null) {
  	// 	data = data.readUInt8(0);
  	// }
      cb(err, data);
    }
  );
}

WICEDSense.prototype._getServiceCharacteristic = function(characteristicId, cb) {
  this.connection.getServiceCharacteristic(this.serviceId, characteristicId, cb);
}
