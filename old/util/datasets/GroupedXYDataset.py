'''
Created on 20.05.2011

@author: christian
'''

from util.NumericToolBox import NumericToolBox


class GroupedXYDataset:
    xes = None
    groups = dict()
    tuples = list()
    scaletime = 1

    def __init__(self, scaleTime=1):
        self.xes = list()
        self.groups = dict()
        self.scaletime = scaleTime

    def addValue(self, xvalue, yvalue):
        if xvalue not in self.groups:
            self.xes.append(xvalue)
            self.groups[xvalue] = list()
        self.groups[xvalue].append(yvalue)
        self.tuples.append((xvalue, yvalue))

    def getGroupedMean(self):
        nt = NumericToolBox()
        times = list()
        means = list()
        for x in self.xes:
            ys = self.groups.get(x)
            times.append(x / self.scaletime)
            means.append(nt.mean(ys))

        return times, means
