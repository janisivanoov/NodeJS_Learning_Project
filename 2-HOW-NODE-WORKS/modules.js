//console.log(arguments);
//console.log(require('module').wrapper);

//exports 1
const C = require('./test-modules-1');
const calc1 = new C();
console.log*calc1.add(2, 5);

//exports 2
const {add , mulitply} = require('./test-module-2');
console.log(mulitply(2,3));

//caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();