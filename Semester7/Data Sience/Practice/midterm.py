# def calculation(x, y):
#     reminder = x % y
#     print(f"Reminder is : {reminder}")

# calculation(10, 5)

# val = input("enter your value please: ")
# print(val)

# import random

# print(random.randint(10, 15))

import numpy as np
from fractions import *
import cmath
# a = np.array([1,2,4,5,6], dtype=float)
# print(type(a))
# print(a.dtype)
# print(a.ndim)
# print(a.shape)
# print(a.size)
# print(a.nbytes)

# a = np.loadtxt("hi.txt", dtype=int)
# print(a[:])
# print(a[0])
# print(a[a.size-1])
# print(a[1:])
# print(a[:1])

# x = np.arange(16).reshape(4,4)
# print(x)
# x = np.arange(16).reshape(4,4)
# new_array = np.resize(x,(2,2))
# print(x)
# print(new_array)

# a = 10
# b = 4

# print(a&b)

# s = "Hello World !"

# # print("hello world " * 3)
# print(s.split())
# print(s.join(s))

# print(Fraction(3,5) + 3 * 2)


# x = 5
# y = 3

# z = complex(x,y)
# print(z)
# b = z.real
# print(b)
# i = z.imag
# print(i, end="")

# val = input("Enter your age pleae: ")
# print(val)

# st = str(input("enter your age"))
# print(st)
# print(type(st))

# x, y = input("Enter two values: ").split()
# print("Number of X: ", x)
# print("Number of Y: ", y)

# try:
#     a=float(input("Please enter float value::\n"))
#     print(f"Your float value is : {a}"); 
# except Exception as e:
#     print(f"Error: {e}")

# while True:
#     try: 
#         x = int(input("Please enter a number:"))
#         print(f"Your value is: {x}")
#         break
#     except Exception as e:
#         print(f"Oops!, {e}")


# a = np.linspace(start=0,stop=9,num=5)
# print(a)

# a = np.ones(shape=5)
# print(a)
# b = np.full(shape=5, fill_value=1)
# print(b)


# a = np.loadtxt("hi.txt")
# print(a)

# ls = np.array([1,2,3,4,5])
# a = np.asarray(ls, dtype=float)
# print(a)
# print(np.append(ls, 44))
# # print(ls)
# print(np.delete(ls, 2))

# ls.resize(10)
# print(ls)

# x = np.array([1,2,3])
# y = np.array([4,5,6])
# z = np.append(x,y)
# print(z)

# v = np.array([1.2,7.4,4.2,8.5,6.3])

# print(v)
# print(v[:])
# print(v[0])
# print(v[v.size-1])
# print(v[1:3])
# print(v[:3])
# print(v[2:])
# print(v[-1])
# print(v[-3:])


# x = np.array([[2,3,4],[5,6,7]])
# print(x)
# print("#########################")
# y = np.reshape(x, 6)
# print(y)


# x = np.arange(16).reshape(4,4)
# print("Original Arrays: ")
# print(x)
# print("########################")
# print("Resized Array: ")
# new_array = np.resize(x,(3,3))
# print(new_array)
# print("########################")
# new_array2 = np.insert(new_array,0,34)
# print(new_array2)

import statistics

# data = [100,60,70,900,100,200,500,500,503,600,1000,1200]

# m = statistics.median(data)
# print(m)

# def calculate_median(numbers):
#     N = len(numbers)
#     numbers.sort()
#     if N % 2 == 0:
#         m1 = N / 2
#         m2 = N / 2 + 1
#         m1 = int(m1) - 1
#         m2 = int(m2) - 1
#         median = (numbers[m1] + numbers[m2])
#     else:
#         m = (N+1) / 2
#         m = int(m) - 1
#         median = numbers[m]
#     return median


# data = [100,60,70,900,100,200,500,500,503,600,1000,1200]
# print(calculate_median(data))

from collections import Counter

simpleList = [1,1,1,2,4,5,6,6]

c = Counter(simpleList)

# print(c.most_common(2))

print(np.sum(simpleList))
print(np.mean(simpleList))
print(np.median(simpleList))
print(np.average(simpleList))
print(np.std(simpleList))
print(np.var(simpleList))
print(np.ptp(simpleList))
print(np.min(simpleList))
print(np.max(simpleList))
# print(np.percentile(simpleList))
# print(np.quantile(simpleList))