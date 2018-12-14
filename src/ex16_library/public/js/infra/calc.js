export class Calc {
    average(arr) {
        if (typeof arr !== 'object') return NaN;
        if(arr.constructor !== Array) return NaN;
        if(!arr.length) return 0;
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'number' || isNaN(arr[i])) return NaN;
            sum += arr[i];
        }
        return sum / arr.length;
    }

    countEach(arr) {
        if (typeof arr !== 'object') return false;
        if(arr.constructor !== Array) return false;
        if(!arr.length) return false;
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
