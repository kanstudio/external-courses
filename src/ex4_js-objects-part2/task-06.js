'use strict';

function capitalizeWords(str) {
    return str.replace(/\w+[^\s]*/g, function(word) {return word[0].toUpperCase() + word.substr(1);});
}

module.exports = capitalizeWords;
