'use strict';

function mapArr(arr, callback) {
    let result = arr.map(callback);
    return result;
}

module.exports = mapArr;
