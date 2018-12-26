from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent = 2)
print(square(2))