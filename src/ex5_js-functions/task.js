'use strict';

let Calculator = (function() {
    let x = 0;
    
    function add(y) {

        x += y === undefined ? 0 : y;
        return add;
    }

    add.toString = function() {
        return x;
    };

    function subtract(y) {
        x -= y === undefined ? 0 : y;
        return subtract;
    }

    subtract.toString = function() {
        return x;
    };
    
    function multiply(y) {
        x *= y === undefined ? 1 : y;
        return multiply;
    }

    multiply.toString = function() {
        return x;
    };

    function divide(y) {
        x /= y === undefined ? 1 : y;
        return divide;
    }

    divide.toString = function() {
        return x;
    };

    function getResult() {
        return +x;
    }

    function reset() {
        x = 0;
        return x;
    }

    return {
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide,
        getResult: getResult,
        reset: reset
    };
}());

module.exports = Calculator;
