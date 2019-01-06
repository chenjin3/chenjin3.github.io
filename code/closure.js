function make_counter() {
    let count = 0;
    function inc_count() {
        count++;
        return count;
    }
    return inc_count;
}

let c1 = make_counter();
let c2 = make_counter();

console.log(c1());
console.log(c2());
console.log(c1());