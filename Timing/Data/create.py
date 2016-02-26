#!/usr/bin/python

# # Open a file
# file_50 = open("50KB.txt", "r")
#
# arr_50kb = []
# for line in file_50.readlines():
#     arr_50kb.append(float(line))
#     print(line)
#
# print(arr_50kb)
#
# # Close opend file
# file_50.close()

## Open the file with read only permit
f_50 = open('50KB.log', "r")
f_60 = open('60KB.log', "r")
f_100 = open('100KB.log', "r")
f_200 = open('200KB.log', "r")

## use readlines to read all lines in the file
## The variable "lines" is a list containing all lines
lines_50 = f_50.readlines()
lines_60 = f_60.readlines()
lines_100 = f_100.readlines()
lines_200 = f_200.readlines()

results_50 = []
results_60 = []
results_100 = []
results_200 = []

for l in lines_50:
    l = l.strip('\n')
    value = float(l)
    results_50.append(value)

for l in lines_60:
    l = l.strip('\n')
    value = float(l)
    results_60.append(value)

for l in lines_100:
    l = l.strip('\n')
    value = float(l)
    results_100.append(value)

for l in lines_200:
    l = l.strip('\n')
    value = float(l)
    results_200.append(value)

## close the file after reading the lines.
f_50.close()
f_60.close()
f_100.close()
f_200.close()
