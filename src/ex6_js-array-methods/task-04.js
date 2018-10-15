'use strict';

function filterArr(arr, callback) {
    let result = [];
    for(let i=1; i<arr.length; i++) {
        if(callback(arr[i], i, arr)) result.push(arr[i]);
    }
    return result;
}

module.exports = filterArr;
