'use strict';

var obj = {};
obj.flag = true;
obj.message = 'the new object';
obj.x = 10;
obj.excess = [1, 2, null];

delete obj.excess;
