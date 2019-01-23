#include <iostream>

template<int N>
struct Fac{
    static int const value= N * Fac<N-1>::value;
};

template<>
struct Fac<0>{
    static int const value = 1;
};

using namespace std;

int main() {
    cout<< Fac<5>::value << endl;
}
