/* jshint esversion: 6 */

(function () {
    'use strict';

    function Device() {
        this.state = false;
    }

    Device.prototype.switchOn = function () {
        this.state = true;
    };

    Device.prototype.switchOff = function () {
        this.state = false;
    };

    function Iron(name, power) {
        this.name = name;
        this.power = power;
        Device.apply(this);
    }

    Iron.prototype = Object.create(Device.prototype);
    Iron.prototype.constructor = Iron;

    function TV(name, power) {
        this.name = name;
        this.power = power;
        Device.apply(this);
    }

    TV.prototype = Object.create(Device.prototype);
    TV.prototype.constructor = TV;

    var iron1 = new Iron('Iron 1', 400);
    var iron2 = new Iron('Iron 2', 450);
    var iron3 = new Iron('Iron 3', 500);
    var tv1 = new TV('TV 1', 200);
    var tv2 = new TV('TV 2', 250);
    var tv3 = new TV('TV 3', 300);
    var tv4 = new TV('TV 4', 350);

    function Room() {
        Object.defineProperty(this, 'consumption', {
            get: function () {
                return this.devices.reduce((prev, dev) => 
                    dev.state ? prev += dev.power : prev, 0);
            },
            set: function (val) {
                return false;
            }
        });
        this.devices = [];
    }

    Room.prototype.addDevice = function (device) {
        this.devices.push(device);
        if(device.state) this.consumption += device.power;
        return this;
    };

    Room.prototype.findDevice = function (devName) {
        let devicesInRoom = this.devices.filter(dev => dev.name === devName);
        if (devicesInRoom.length) {
            let roomInfo = 'Device ' + devName + ':\n';
            devicesInRoom.forEach((dev, i) => roomInfo += (i + 1) +
                '. weight: ' + dev.power + '\n');
            return roomInfo;
        }
        return false;
    };

    let room = new Room();

    room.addDevice(iron1).addDevice(iron2).addDevice(iron3).addDevice(tv1)
        .addDevice(tv2).addDevice(tv3).addDevice(tv4);

    iron1.switchOn();
    iron3.switchOn();
    tv2.switchOn();
    tv4.switchOn();

    console.log(room.consumption);

    console.log(room.findDevice('Iron 1'));

}());
