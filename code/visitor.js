function Visitor() {
    this.push = function(ele, ...args) { //visit function 
             return Array.prototype.push.apply(ele, args);
    }
    this.pop = function(ele) {
             return Array.prototype.pop.apply(ele);
    }
 };
 
 let v = new Visitor();
 let ele = new Object();
 
 v.push(ele, 1, 2, 3, 4);
 console.log(ele); // { '0': 1, '1': 2, '2': 3, '3': 4, length: 4 }
 
 v.pop(ele);
 console.log(ele); //{ '0': 1, '1': 2, '2':3, length: 3 }