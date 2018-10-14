'use strict';

function viewObject(obj) {
    var key;
    for(key in obj) {
        console.log(key + ': ' + obj[key]);
    }
}

module.exports = viewObject;
