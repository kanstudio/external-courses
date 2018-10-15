'use strict';

function sliceArr(arr, start, end) {
    let result = [];
    let endpos = end >= arr.length ? arr.length-1 : end;
    for(let i=start; i<endpos; i++) {
        result.push(arr[i]);
    }
    return result;
}

module.exports = sliceArr;
