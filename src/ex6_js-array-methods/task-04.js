'use strict';

function filterArr(arr, callback) {
    let result = arr.filter(callback);
    return result;
}

module.exports = filterArr;
