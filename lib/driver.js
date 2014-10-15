"use strict";

var Cylon = require('cylon');

var Driver = module.exports = function Driver(opts) {
  Driver.__super__.constructor.apply(this, arguments);
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

Driver.prototype.start = function(callback) {
  callback();
};

Driver.prototype.halt = function(callback) {
  callback();
};

Driver.prototype._getServiceCharacteristic = function(characteristicId, callback) {
  this.connection.readServiceCharacteristic(this.serviceId, characteristicId, callback);
};
