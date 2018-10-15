const task = require('~utils').createTask('ex6_js-array-methods');

describe('Ex6. JS Array methods', () => {
    task('01', code => {
        const arr = ['a', 'b', 'c', 'd', 'e'];

        it("should copy from element 1 and to element 4 (without including)", () => {
            expect(code(arr, 1, 4)).toBe(['e', 'c', 'd']);
        });
    });
});
