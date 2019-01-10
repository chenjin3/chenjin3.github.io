//command:   node --harmony_tailcalls tailRecursion.js
"use strict";


let callStack = [];
console.log(callStack);  
function fib(n) {   
    callStack.push('fib('+ n +')');      
    console.log(callStack); 
    if (n <= 1){    
    	
        return n;  
    } else {    
        return fib(n-1) + fib(n - 2); 
    }
}

console.log(fib(5))


 /*
  
 imagine a,b moving along the sequence as such:
  
  b,a
  0,1,1,2,3,5 ....
  
    b,a
  0,1,1,2,3,5 ....
  
      b,a
  0,1,1,2,3,5 ....
  
  etc...
  
  */
function fibIter(n){
    var a = 1, b = 0, temp;
  
    while (n > 0){
      temp = a;
      a = a + b;
      b = temp;
      n--;
    }
  
    return b;
  }
  
 

let bigInt = require("big-integer");

function fibIterRecursive(n, a, b){
    if (n === 0) {
      return b;
    } else {
      return fibIterRecursive(n-1, bigInt(a).add(bigInt(b)), bigInt(a));
    }
  };
  
function fib2(n){
    return fibIterRecursive(n, 1, 0);
}

console.log(fib2(2345).toString())


