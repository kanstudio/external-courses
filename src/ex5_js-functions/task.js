'use strict';

let Calculator = (function() {
    let x = 0;
    
    function add(y) {
        x += y;
        return add;
    }

    add.toString = function() {
        return x;
    };

    function subtract(y) {
        x -= y;
        return subtract;
    }

    subtract.toString = function() {
        return x;
    };
    
    function multiply(y) {
        x *= y;
        return multiply;
    }

    multiply.toString = function() {
        return x;
    };

    function divide(y) {
        x /= y;
        return divide;
    }

    divide.toString = function() {
        return x;
    };

    function getResult(y) {
        return +x;
    }

    function reset() {
        return x = 0;
    }

    return {
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide,
        getResult: getResult,
        reset: reset
    };
})();

module.exports = Calculator;
