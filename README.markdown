# Cylon.js For Bluetooth LE

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things using Node.js

This repository contains the Cylon adaptor/drivers to connect to Bluetooth Low Energy (LE) peripherals. It uses the Noble node module (https://github.com/sandeepmistry/noble) created by [@sandeepmistry](https://github.com/sandeepmistry) thank you!

For more information about Cylon, check out the repo at
https://github.com/hybridgroup/cylon

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-ble.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-ble) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-ble/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-ble) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-ble/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-ble)

## Getting Started

Install the module with: `npm install cylon-ble`

## Examples

## Connecting

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'wiced', adaptor: 'ble', uuid: '207377654321'},
  device: {name: 'battery', driver: 'ble-battery-service'},

  work: function(my) {
    every((1).second(), function() {
      my.battery.getBatteryLevel(function(err, data){
        if (err) {
          console.log(err);
        } else {
          console.log("BatteryLevel:", data);
        }
      });
    });
  }
}).start();
```
You will need a computer with a hardware adaptor that supports Bluetooth LE, also known as Bluetooth 4.0, or Bluetooth Smart. Also, this module currently only supports OSX and Linux operating systems.

## Contributing

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & lint and test your code using `make test` and `make lint`.
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

None yet...

## License

Copyright (c) 2014 The Hybrid Group. Licensed under the Apache 2.0 license.
