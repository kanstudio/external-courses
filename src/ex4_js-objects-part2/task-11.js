'use strict';

function countLetters(str) {
    let source = str.replace(/\s+/g, '');
    let result = {};
    for(let i=0; i<source.length; i++) {
        result[source[i]] = result[source[i]] === undefined ? 1 : ++result[source[i]];
    }
    for(let key in result) {
        console.log('\'' + key + '\' - ' + result[key] + ' шт.');
    }
}

module.exports = countLetters;
