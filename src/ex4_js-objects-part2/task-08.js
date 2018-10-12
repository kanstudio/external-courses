'use strict';

function setCamelCase(str) {
    let result = str.trim().toLowerCase();
    result = result.replace(/\w+[^\s]*/g, function(word) {
        return word[0].toUpperCase() + word.substr(1);
    });
    result = result[0].toLowerCase() + result.substr(1).replace(/\s+/g, '');
    return result;
}

module.exports = setCamelCase;
