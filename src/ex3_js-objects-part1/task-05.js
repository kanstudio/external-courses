'use strict';

function cloneObject(obj) {
    var clone = {}, key;
    for(key in obj) {
        clone[key] = obj[key];
    }
    return clone;
}

module.exports = cloneObject;
