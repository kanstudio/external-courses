'use strict';

function findProp(prop, obj) {
    if(prop in obj && !obj.hasOwnProperty(prop)) return obj[prop];
    return undefined;
}

module.exports = findProp;
