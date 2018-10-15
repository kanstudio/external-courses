'use strict';

function reduceArr(arr, callback, initialValue) {
    let result = arr.reduce(callback, initialValue);
    return result;
}

module.exports = reduceArr;
