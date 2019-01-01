#include <iostream>
#include <vector>
#include <algorithm> //std::remove_if
#include <numeric>      // std::accumulate

using namespace std;

int main() {
    vector<string> str = {"Programming", "in", "a", "functional", "style."};
    vector<int> vout; //输出列表
    
    //map
    transform(str.begin(), str.end(), back_inserter(vout), [](string s){ return s.length ();} );
    for(auto val : vout) {
        cout<< val << endl;
    }
    
    //filter
    //remove_if only guarantees that [begin, middle) contains the matching elements
    vector<string>::iterator newEnd = remove_if(str.begin(),  str.end(), [](string s) {return !(isupper(s[0]));} );
    for(auto it = str.begin(); it != newEnd; ++it) {
        cout<< *it << endl;
    }

    //reduce
    string jointStr = accumulate(str.begin(), str.end(), string(""), [](string acc, string cur){ return acc + ":" + cur; });
    cout<< jointStr << endl;
}

//compiling command: clang++ mapFilterReduce.cc -std=c++0x -o mapFilterReduce