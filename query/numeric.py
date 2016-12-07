#!/usr/bin/env python3

import numpy as np
import scipy.stats as stats
import math


def removeNoneEntries(data):
    return [a for a in data if a is not None]


def calcCDF(sampleData):
    numberOfBins = len(sampleData)

    rangeStart = float(min(sampleData))
    rangeStop = float(max(sampleData))

    counts, bin_edges = np.histogram(a=sampleData, range=(rangeStart, rangeStop), bins=numberOfBins, normed=False)
    cdf = np.cumsum(counts)
    scale = 1.0 / cdf[-1]
    ncdf = cdf * scale

    return bin_edges[1:], ncdf


def mean_confidence_interval(data, confidence=0.95):
    a = removeNoneEntries(np.array(data))
    n = len(a)
    m, se = np.mean(a), np.std(a)
    h = se * stats.t._ppf((1 + confidence) / 2., n - 1)
    return m, m - h, m + h


def mean_percentiles(data, percentileUpper=0.9, percentileLower=0.1):
    a = removeNoneEntries(np.array(data))
    n = len(a)
    m = np.mean(a)
    return m, np.percentile(a, percentileLower), np.percentile(a, percentileUpper)


# removeOutlinersUsingMean = removeOutliners(deviation=np.mean)
# removeOutlinersUsingMedian = removeOutliners(deviation=np.median)
def removeOutliers(data, deviation=np.mean, flexibility=2):
    if data is None or len(data) == 0:
        return []

    a = removeNoneEntries(np.array(data))
    dev = deviation(a)
    std = np.std(a)

    if (std == 0):
        # all items in data are similar
        return data

    return [a for a in data if abs(a - dev) < flexibility * std]


def mean_confidence_width(data, confidence=0.95):
    if data is None or len(data) == 0:
        return None
    if len(data) == 1:
        return (a[0], 0)

    a = removeNoneEntries(np.array(data))
    n = len(a)
    m, se = np.mean(a), np.std(a)
    h = se * stats.t._ppf((1 + confidence) / 2., n - 1) / math.sqrt(n)
    return m, h


def mean_confidence_width_norm(data, confidence=0.95):
    a = removeNoneEntries(np.array(data))
    n = len(a)
    m, se = np.mean(a), np.std(a)
    h = se * stats.norm._ppf((1 + confidence) / 2) / math.sqrt(n)
    return m, h
