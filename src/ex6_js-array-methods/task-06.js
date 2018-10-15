'use strict';

function reduceArr(arr, callback, initialValue) {
    let previousValue = initialValue === undefined ? arr[0] : initialValue;
    for(let i=initialValue === undefined ? 1 : 0; i<arr.length; i++) {
        previousValue = callback(previousValue, arr[i], i, arr);
    }
    return previousValue;
}

module.exports = reduceArr;
