#!/usr/bin/python

import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import gaussian_kde

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
    if value < 10 :
        results_50.append(value)


for l in lines_60:
    l = l.strip('\n')
    value = float(l)
    if value < 10 :
        results_60.append(value)

for l in lines_100:
    l = l.strip('\n')
    value = float(l)
    if value < 10 :
        results_100.append(value)

for l in lines_200:
    l = l.strip('\n')
    value = float(l)
    if value < 10 :
        results_200.append(value)

## close the file after reading the lines.
f_50.close()
f_60.close()
f_100.close()
f_200.close()

# plt.plot(lines_50, 'c')
# plt.plot(lines_60, 'r')
# plt.plot(lines_100, 'b')
# plt.plot(lines_200, 'g')
# plt.ylabel('some numbers')
# plt.show()

#
# plt.hist(results_50)
# plt.title("Gaussian Histogram")
# plt.xlabel("Value")
# plt.ylabel("Frequency")
# plt.show()

# plt.hist(results_50, label='50KB')
# plt.hist(results_60, label='60KB')
# plt.hist(results_100, label='100KB')
# plt.hist(results_200, label='200KB')
plt.xlabel('Time')



kdea = gaussian_kde( results_50 )
kdeb = gaussian_kde( results_60 )
kdec = gaussian_kde( results_100 )
kded = gaussian_kde( results_200 )
# these are the values over wich your kernel will be evaluated
dist_spacea = np.linspace( min(results_50), max(results_50), 100 )
dist_spaceb = np.linspace( min(results_60), max(results_60), 100 )
dist_spacec = np.linspace( min(results_100), max(results_100), 100 )
dist_spaced = np.linspace( min(results_200), max(results_200), 100 )
# plot the results
plt.plot( dist_spacea, kdea(dist_spacea), label='50KB' )
plt.plot( dist_spaceb, kdeb(dist_spaceb), label='60KB' )
plt.plot( dist_spacec, kdec(dist_spacec), label='100KB' )
plt.plot( dist_spaced, kded(dist_spaced), label='200KB' )



# y,binEdges=np.histogram(results_50)
# bincenters = 0.5*(binEdges[1:]+binEdges[:-1])
# plt.plot(bincenters,y, 'r', label='50KB')
#
# a,b=np.histogram(results_60)
# bincenters = 0.5*(b[1:]+b[:-1])
# plt.plot(bincenters,a, 'g', label='60KB')
#
# c,d=np.histogram(results_100)
# bincenters = 0.5*(d[1:]+d[:-1])
# plt.plot(bincenters,c, 'y', label='100KB')
#
# e,f=np.histogram(results_200)
# bincenters = 0.5*(f[1:]+f[:-1])
# plt.plot(bincenters,e, 'c', label='200KB')

plt.legend(loc='upper right')
plt.show()
