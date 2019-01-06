function bindFirstArg(func, first) {
    return function(second) {
        return func(first, second);
    }
}
function bindSecondArg(func, second) {
    return function(first) {
        return func(first, second);
    }
}

let powerOfTwo = bindFirstArg(Math.pow, 2);
console.log(powerOfTwo(5)); //32

let squareOf = bindSecondArg(Math.pow, 2);
console.log(squareOf(3)); // 9

let cubeOf = bindSecondArg(Math.pow, 3);
console.log(cubeOf(3)); // 27

let makePowersOf = bindFirstArg(bindFirstArg, Math.pow);
let powerOfThree = makePowersOf(3);
console.log(powerOfThree(2)); // 9




Function.prototype.partialApply = function() {
    let func = this;
    let args = Array.prototype.slice.call(arguments);
    return function() {
        let newArgs = [].slice.call(arguments);
        return func.apply(this, args.concat(newArgs));
    }
}

let greet = function(greeting, name, punctuation) {
    return greeting + ' ' + name + ' ' + punctuation;
};
  
let sayHelloTo = greet.partialApply('hello');
console.log(sayHelloTo('Marlon', ': )'));
let sayHelloToKevin = greet.partialApply('hello', 'Kevin');
console.log(sayHelloToKevin('!'));