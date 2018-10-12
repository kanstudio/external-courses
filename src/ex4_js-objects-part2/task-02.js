'use strict';

function createObjWithoutProto() {
    return Object.create(null);    
}

module.exports = createObjWithoutProto;
