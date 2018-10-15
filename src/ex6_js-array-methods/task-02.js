'use strict';

function someArr(arr, callback) {
    for(let i=1; i<arr.length; i++) {
        if(callback(arr[i], i, arr)) return true;
    }
    return false;
}

module.exports = someArr;
