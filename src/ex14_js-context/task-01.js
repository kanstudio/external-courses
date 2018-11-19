'use strict';

let Calculator = (function() {
    let calcData = {
        x: 0,
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide,
        getResult: getResult,
        setState: setState,
        reset: reset,
        fetchData: fetchData
    };
    
    function add(y=0) {
        this.x += y;
        return this;
    }

    function subtract(y=0) {
        this.x -= y;
        return this;
    }
    
    function multiply(y=1) {
        this.x *= y;
        return this;
    }

    function divide(y=1) {
        this.x /= y;
        return this;
    }

    function getResult() {
        return this.x;
    }

    function setState(y=this.x) {
        this.x = y;
        return this;
    }

    function reset() {
        this.x = 0;
        return this;
    }

    function fetchData(callback) {
        this.x = 500;
        callback(this.getResult());
        return this;
    }

    return calcData;
}());

module.exports = Calculator;
