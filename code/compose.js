Function.prototype.compose = function(prevFunc) {
    let nextFunc = this;
    return function() {
        return nextFunc.call(this, prevFunc.apply(this, arguments));
    }
}

function func1(a) {
    return a + ' 1';
}
function func2(b) {
    return b + ' 2';
}
function func3(c) {
    return c + ' 3';
}

let composition = func3.compose(func2).compose(func1);
console.log(composition('count'));
