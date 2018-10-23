'use strict';

function getRandom0to100() {
    return +((Math.random() * 100).toFixed(12));
}

module.exports = getRandom0to100;
