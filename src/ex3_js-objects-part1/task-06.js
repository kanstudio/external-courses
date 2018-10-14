'use strict';

function deepCloneObject(obj) {
    var key;
    var clone = obj.constructor === Array ? [] : {};
    for(key in obj) {
        clone[key] = typeof obj[key] === 'object' ? deepCloneObject(obj[key]) : obj[key];
    }
    return clone;
}

module.exports = deepCloneObject;
