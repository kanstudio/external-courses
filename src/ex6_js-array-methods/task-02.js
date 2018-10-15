'use strict';

function someArr(arr, callback) {
    let result = arr.some(callback);
    return result;
}

module.exports = someArr;
