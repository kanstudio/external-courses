'use strict';

function truncateString(str, len) {
    if(str.length > len) return str.substring(0, len - 1) + '…';
    return str;
}

module.exports = truncateString;
