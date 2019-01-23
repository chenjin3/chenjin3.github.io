let Lazy = require('lazy.js');

function square(x) { return x * x; }
function isEven(x) { return x % 2 === 0; }

let array = Lazy.range(100).toArray();
//console.log(array);
let result = Lazy(array).map(square).filter(isEven).first(5);
//console.log(result);

result.each((e) => {
    console.log(e);
});
console.log(result.toArray());

let fibonacci = Lazy.generate(function() {
    var x = 1,
        y = 1;
    return function() {
      var prev = x;
      x = y;
      y += prev;
      return prev;
    };
  }());
console.log(fibonacci.take(5).toArray());
  