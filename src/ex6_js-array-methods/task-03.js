'use strict';

function everyArr(arr, callback) {
    for(let i=1; i<arr.length; i++) {
        if(!callback(arr[i], i, arr)) return false;
    }
    return true;
}

module.exports = everyArr;
