export class Calc {
    average(arr) {
        if (typeof arr !== 'object') return NaN;
        if (arr.constructor !== Array) return NaN;
        if (!arr.length) return 0;
        if (arr.some(x => typeof x !== 'number' || isNaN(x))) return NaN;
        return arr.reduce((sum, item) => sum += item, 0) / arr.length;
    }

    countEach(arr) {
        if (typeof arr !== 'object') return false;
        if (arr.constructor !== Array) return false;
        if (!arr.length) return false;
        const counts = {};
        arr.forEach(val => {
            if (typeof val === 'number' || typeof val === 'string') {
                if (val in counts) counts[val]++;
                else counts[val] = 1;
            }
        })
        return counts;
    }
};
