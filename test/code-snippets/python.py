#normal strings
print 'Hello, world!'
print "Hello, world!"

#looooooooooooooong strings
print """Hello, world!"""
print '''Hello, world!'''

#raw strings
print r"hello"
print r'hello'
print R"hello"
print R'hello'

print r'''hello'''
print R'''hello'''
print r"""hello"""
print R"""hello"""

#binary strings
print br"hello"
print br'hello'
print bR"hello"
print bR'hello'
print Br"hello"
print Br'hello'
print BR"hello"
print BR'hello'

print br"""hello"""
print br'''hello'''
print bR"""hello"""
print bR'''hello'''
print Br"""hello"""
print Br'''hello'''
print BR"""hello"""
print BR'''hello'''

#fibonacci tuple assignment
parents, babies = (1, 1)
while babies < 100:
    print 'This generation has %d babies' % babies
    parents, babies = (babies, parents + babies)

#import, regex
import re
for test_string in ['555-1212', 'ILL-EGAL']:
    if re.match(r'^\d{3}-\d{4}$', test_string):
        print test_string, 'is a valid US local phone number'
    else:
        print test_string, 'rejected'

#!/usr/bin/env python
# This program adds up integers in the command line
import sys
try:
    total = sum(int(arg) for arg in sys.argv[1:])
    print 'sum =', total
except ValueError:
    print 'Please supply integer arguments'

class BankAccount(object):
    def __init__(self, initial_balance=0):
        self.balance = initial_balance
    def deposit(self, amount):
        self.balance += amount
    def withdraw(self, amount):
        self.balance -= amount
    def overdrawn(self):
        return self.balance < 0
my_account = BankAccount(15)
my_account.withdraw(5)
print my_account.balance


#8-Queens
BOARD_SIZE = 8

class BailOut(Exception):
    pass

def validate(queens):
    left = right = col = queens[-1]
    for r in reversed(queens[:-1]):
        left, right = left-1, right+1
        if r in (left, col, right):
            raise BailOut

def add_queen(queens):
    for i in range(BOARD_SIZE):
        test_queens = queens + [i]
        try:
            validate(test_queens)
            if len(test_queens) == BOARD_SIZE:
                return test_queens
            else:
                return add_queen(test_queens)
        except BailOut:
            pass
    raise BailOut

queens = add_queen([])
print queens
print "\n".join(". "*q + "Q " + ". "*(BOARD_SIZE-q-1) for q in queens)

variableName = 4**5
complexNumber = 4j += 1

constants = (None, True, False, NotImplemented, __debug__, Ellipsis)
ellipsis = ...

import unittest
def median(pool):
    copy = sorted(pool)
    size = len(copy)
    if size % 2 == 1:
        return copy[(size - 1) / 2]
    else:
        return (copy[size/2 - 1] + copy[size/2]) / 2
class TestMedian(unittest.TestCase):
    def testMedian(self):
        self.failUnlessEqual(median([2, 9, 9, 7, 9, 2, 4, 5, 8]), 7)
if __name__ == '__main__':
    unittest.main()

