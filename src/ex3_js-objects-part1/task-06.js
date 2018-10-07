'use strict';

function deepCloneObject(obj) {
    var clone = {}, key;
    for(key in obj) {
        clone[key] = typeof obj[key] === 'object' ? deepCloneObject(obj[key]) : obj[key];
    }
    return clone;
}

module.exports = deepCloneObject;
