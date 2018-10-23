'use strict';

function existProp(str, obj) {
    return str in obj;
}

module.exports = existProp;
