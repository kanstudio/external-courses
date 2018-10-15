'use strict';

function sliceArr(arr, start, end) {
    let result = [];
    end = end >= arr.length ? arr.length-1 : end;
    for(let i=start; i<end; i++) {
        result.push(arr[i]);
    }
    return result;
}

module.exports = sliceArr;
