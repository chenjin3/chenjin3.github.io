#include <iostream>
using namespace std;

int main() {
    // 定义简单的lambda表达式
    auto basicLambda = [] { cout << "Hello, world!" << endl; };
    // 调用
    basicLambda();   // 输出：Hello, world!
}
