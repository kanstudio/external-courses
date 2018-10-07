'use strict';

function addPropIfNotExists(str, obj) {
    if(!(str in obj)) obj[str] = 'new';
    return obj;
}

module.exports = addPropIfNotExists;
