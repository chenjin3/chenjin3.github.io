#include <iostream>
#include <vector>
#include <algorithm> //std::remove_if
#include <numeric>      // std::accumulate

using namespace std;

int main() {
    vector<string> str = {"Programming", "in", "a", "functional", "style."};
    vector<int> vout; //输出列表
    vector<int> arr{1,2,3,4,5,6,7,8,9};
    vector<int> arrOut;
    
    //map
    transform(str.begin(), str.end(), back_inserter(vout), [](string s){ return s.length ();} );
    for(auto val : vout) {
        cout<< val << " ";
    }
    cout << endl;

    arrOut.resize(arr.size());
    transform(arr.begin(), arr.end(), arrOut.begin(), [](int d){return d*2;});
    for (auto value : arrOut) {
		cout << value << " "; //2, 4, 6,8,10,12,14,16,18
	}
    cout<<endl;

    //filter
    //remove_if only guarantees that [begin, middle) contains the matching elements
    vector<string>::iterator endFilter = remove_if(str.begin(),  str.end(), [](string s) {return !(isupper(s[0]));} );
    for(auto it = str.begin(); it != endFilter; ++it) {
        cout<< *it << endl;
    }

    //reduce
    string jointStr = accumulate(str.begin(), str.end(), string(""), [](string first, string second){ return first + ":" + second; });
    cout<< jointStr << endl;
}

//compiling command: clang++ mapFilterReduce.cc -std=c++0x -o mapFilterReduce