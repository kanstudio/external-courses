'use strict';

function reduceArr(arr, callback, initialValue) {
    let result;
    if(initialValue === undefined) result = arr.reduce(callback);
    else result = arr.reduce(callback, initialValue);
    return result;
}

module.exports = reduceArr;
