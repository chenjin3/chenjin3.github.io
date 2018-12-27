class Counter:
    def __init__(self, low, high):
        # set class attributes inside the magic method __init__
        # for "initialize"
        self.current = low
        self.high = high

    def __iter__(self):
        # first magic method to make this object iterable
        return self

    def __next__(self):
        # second magic method
        if self.current > self.high:
            raise StopIteration
        else:
            self.current += 1
            return self.current - 1 # current 

for c in Counter(3, 8):
    print(c)

x = [1, 2, 3, 5, 5]
def square(num):
    return num * num

print(list(map(square, x))) # map(function, iterable)