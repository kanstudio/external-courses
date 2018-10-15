'use strict';

function everyArr(arr, callback) {
    let result = arr.every(callback);
    return result;
}

module.exports = everyArr;
