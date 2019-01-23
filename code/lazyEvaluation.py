def fibonacci(n): # 生成器函数 - 斐波那契
    a, b, counter = 1, 1, 0
    while True:
        if (counter > n): 
            return
        yield a
        a, b = b, a + b
        counter += 1
f = fibonacci(10) # f 是一个迭代器，由生成器返回生成

for i in f:
    print(i, end=" ")  # 1 1 2 3 5 8 13 21 34 55 89