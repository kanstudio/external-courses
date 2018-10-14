'use strict';

function addPropIfNotExists(str, obj) {
    var newObj = obj;
    if(!(str in newObj)) newObj[str] = 'new';
    return newObj;
}

module.exports = addPropIfNotExists;
