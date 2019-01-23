#include<iostream>
using namespace std;
  
int AddFunc(int a, int b)  
{  
    return a + b;  
}  
int main(){
    int sum = AddFunc(3,2);
    cout<< sum << endl;


    auto sum2 = []()->int{ return AddFunc(3, 2); }; 
    //cout << sum2 << endl;
    cout << sum2() << endl;
    
    return 0;
}
// clang++ lazyEvaluation.cc -std=c++0x -o lazyEvaluation