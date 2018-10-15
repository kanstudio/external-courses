const task = require('~utils').createTask('ex6_js-array-methods');

describe('Ex6. JS Array methods', () => {
    task('01', code => {
        const arr = ['a', 'b', 'c', 'd', 'e'];

        it("should copy from element 1 and to element 4 (without including)", () => {
            expect(code(arr, 1, 4)).toBe(['b', 'c', 'd']);
        });

        it("should copy from element 2 and to end of array", () => {
            expect(code(arr, 2)).toBe(['c', 'd', 'e']);
        });

        it("should copy whole array", () => {
            expect(code(arr)).toBe(['a', 'b', 'c', 'd', 'e']);
        });

        it("should copy from element 2 and to element 4 (without including)", () => {
            expect(code(arr, -4, -2)).toBe(['b', 'c']);
        });
    });

    task('02', code => {
        const arr = [1, -1, 2, -2, 3];

        it("should return 'true' if callback returns 'true' for one of all elements", () => {
            expect(code(arr, function(item, i, array) {return (item*i-array.length) > 0;})).toBe(true);
        });

        it("should return 'true' if callback returns 'true' for one of all elements", () => {
            expect(code(arr, function(item, i, array) {return (item*i-3*array.length) > 0;})).toBe(false);
        });
    });

    task('03', code => {
        const arr = [1, -4, 2, -1, 3];

        it("should return 'true' if callback returns 'true' for all elements", () => {
            expect(code(arr, function(item, i, array) {return (item*i-array.length) > 0;})).toBe(false);
        });

        it("should return 'true' if callback returns 'true' for all elements", () => {
            expect(code(arr, function(item, i, array) {return (item*i+array.length) > 0;})).toBe(true);
        });
    });

    task('04', code => {
        const arr = [1, -5, 3, -1, 2];

        it("should return new array with elements for which callback returns 'true'", () => {
            expect(code(arr, function(item, i, array) {return (item*i-array.length) > 0;})).toBe([3, 2]);
        });

        it("should return new array with elements for which callback returns 'true'", () => {
            expect(code(arr, function(item, i, array) {return (item*i+array.length) > 0;})).toBe([1, 3, -1, 2]);
        });
    });

    task('05', code => {
        const arr = [1, -5, 3, -1, 2];

        it("should return new array with elements which callback returns", () => {
            expect(code(arr, function(item, i, array) {return item*i-array.length;})).toBe([-5, -10, 1, -8, 3]);
        });

        it("should return new array with elements which callback returns", () => {
            expect(code(arr, function(item, i, array) {return item*i+array.length;})).toBe([5, 0, 11, 2, 13]);
        });
    });

    task('06', code => {
        const arr = [1, -5, 3, -1, 2];

        it("should return single output value which returns callback after all iterations throughout array", () => {
            expect(code(arr, function(sum, current) {return sum + current;})).toBe(0);
        });

        it("should return single output value which returns callback after all iterations throughout array", () => {
            expect(code(arr, function(prev, item, i, array) {return prev*item*i+array.length;}, 7)).toBe(2805);
        });
    });
});
