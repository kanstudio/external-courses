'use strict';

function mapArr(arr, callback) {
    let result = [];
    for(let i=1; i<arr.length; i++) {
        result[i] = callback(arr[i], i, arr);
    }
    return result;
}

module.exports = mapArr;
