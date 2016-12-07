'''
Created on 05.10.2012

@author: Bjoern
'''


class Metric:

    name = ""
    legendPos = ""
    unit = ""
    query = ""
    title = ""
    valueScale = 1
    valueRange = None
    timeRange = None
    minCount = 1
    plotBar = True
    plotCDF = True
    plotCDFIntervals = None
    plotTime = None
    plotBox = None

    def __init__(self, name, legendPos="best", query="single", title=None, valueRange=None, timeRange=None, valueScale=1, minCount=1, plotBar=True, plotCDF=True, plotTime=None, plotBox=None, plotCDFIntervals=None, unit=''):
        self.name = name
        self.legendPos = legendPos
        self.query = query
        if (title is None):
            self.title = name
        else:
            self.title = title
        self.valueRange = valueRange
        self.valueScale = valueScale
        self.timeRange = timeRange
        self.minCount = minCount
        self.plotBar = plotBar
        self.plotCDF = plotCDF
        self.plotTime = plotTime
        self.plotBox = plotBox
        self.plotCDFIntervals = plotCDFIntervals
        if (unit != ''):
            self.unit = ' ' + unit
