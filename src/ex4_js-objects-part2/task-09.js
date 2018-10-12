'use strict';

function insertWord(str, word, pos) {
    let strArr = str.trim().split(/\s+/g);
    strArr[pos] += ' ' + word.trim();
    return strArr.join(' ');
}

module.exports = insertWord;
