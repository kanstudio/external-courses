'use strict';

function findSubString(str, part) {
    return !!~str.indexOf(part);
}

module.exports = findSubString;
