'use strict';

function getRandom(min, max) {
    return +((min + Math.random() * (max - min)).toFixed(0));
}

module.exports = getRandom;
