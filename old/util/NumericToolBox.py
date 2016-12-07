'''
Created on 16.07.2011

@author: christian
'''

import numpy as np
import scipy.stats as stats
import math


class NumericToolBox:

    def removeNoneEntries(self, data):
        temp = list()

        if data is None:
            return temp

        for a in data:
            if a is not None:
                temp.append(float(a))
        return temp

    def calcCDF(self, sampleData):

        numberOfBins = len(sampleData)

        rangeStart = float(min(sampleData))
        rangeStop = float(max(sampleData))

        # numberOfBins = (rangeStop - rangeStart) / 5

        counts, bin_edges = np.histogram(
            a=sampleData, range=(rangeStart, rangeStop), bins=numberOfBins, normed=False)
        cdf = np.cumsum(counts)
        scale = 1.0 / cdf[-1]
        ncdf = cdf * scale

        return bin_edges[1:], ncdf

    def mean_confidence_interval(self, data, confidence=0.95):
        a = self.removeNoneEntries(np.array(data))
        n = len(a)
        m, se = np.mean(a), np.std(a)
        h = se * stats.t._ppf((1 + confidence) / 2., n - 1)
        return m, m - h, m + h

    def mean_percentiles(self, data, percentileUpper=0.9, percentileLower=0.1):
        a = self.removeNoneEntries(np.array(data))
        n = len(a)
        m = np.mean(a)
        return m, np.percentile(a, percentileLower), np.percentile(a, percentileUpper)

    def mean(self, data):
        return np.mean(data)

    def std(self, data):
        return np.std(data)

    def removeOutliersUsingMean(self, data, flexibility=2):
        print("Input data:")
        print(data)

        if data is not None and len(data) > 0:
            a = self.removeNoneEntries(np.array(data))
            m, se = np.mean(a), np.std(a)
            print("Mean", m, "Std:", se)

            if (se == 0):
                # all items in data are similar
                return data

            result = list()
            for a in data:
                if abs(a - m) < flexibility * se:
                    result.append(a)
                else:
                    print("Found outlier: ", a)
            return result
        else:
            return list()

    def removeOutliersUsingMedian(self, data, flexibility=2):
        if data is not None and len(data) > 0:
            a = self.removeNoneEntries(np.array(data))
            m, se = np.median(a), np.std(a)
            result = list()
            for a in data:
                if abs(a - m) < flexibility * se:
                    result.append(a)
                else:
                    print("Found outlier: ", a)
            return result
        else:
            return list()

    def mean_confidence_width(self, data, confidence=0.95):
        if data is not None and len(data) > 0:
            a = self.removeNoneEntries(np.array(data))
            n = len(a)
            m, se = np.mean(a), np.std(a)
            h = se * stats.t._ppf((1 + confidence) / 2., n - 1) / math.sqrt(n)
            return m, h
        else:
            return None

    def mean_confidence_width_norm(self, data, confidence=0.95):
        a = self.removeNoneEntries(np.array(data))
        n = len(a)
        m, se = np.mean(a), np.std(a)
        h = se * stats.norm._ppf((1 + confidence) / 2) / math.sqrt(n)
        return m, h
