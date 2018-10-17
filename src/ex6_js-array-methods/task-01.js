'use strict';

function sliceArr(arr, start, end) {
    let result = [];
    let startpos = start === undefined ? 0 : start;
    if(startpos < 0) startpos += arr.length;
    let endpos = (end === undefined || end >= arr.length) ? arr.length : end;
    if(endpos < 0) endpos += arr.length;
    for(let i=startpos; i<endpos; i++) {
        result.push(arr[i]);
    }
    return result;
}

module.exports = sliceArr;

