Function.prototype.curry = function(numArgs) {
    let func = this;
    numArgs = numArgs || func.length;

    //recursively acquire the arguments
    function subCurry(prev) {
        return function(arg) {
            let args = prev.concat(arg);
            if (args.length < numArgs) {
                return subCurry(args);
            } else {
                // base case: apply the function
                return func.apply(this, args);
            }
        }
    }

    return subCurry([]);
}

let greet = function(greeting, name, punctuation) {
    return greeting + ' ' + name + ' ' + punctuation;
};

let sayHelloTo = greet.curry();
console.log(sayHelloTo('hello')); //returns a curried function
console.log(sayHelloTo('hello')('Marlon')(': )')); // hello Marlon : )
