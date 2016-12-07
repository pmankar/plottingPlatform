'''
Created on 20.05.2011

@author: christian
'''

import platform
import matplotlib as mpl

if platform.system() == "Darwin":
    mpl.use('cocoaagg')

import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import os
import numpy as np


class Plotter:

    outputdir = ""
    outdirs = {}

    # define global colors during plotting
    colors = list()
    hatches = ["", "//", "O", "++", "o", ".", "--"]

    fig = None
    ax = None

    columnData = list()
    yErrorData = list()
    xticks = list()
    count = 0
    rects = list()

    formats = None
    writePlotsToFile = None

    def __init__(self, outputdir="", greyscale=True, formats=set(['png', 'eps', 'pdf'])):

        if greyscale:
            self.colors = ["1", "0.8", "0.6", "0.4", "0.2", '0.0']

        else:
            self.colors = [
                '#005AA9', '#F5A300', '#009D81', '#E6001A', '#A60084', 'green']

        self.formats = formats

        if outputdir != "":
            self.outputdir = os.path.normpath(
                os.path.join(os.path.dirname(__file__), "..", outputdir))
            print("outputdir is:", self.outputdir)
            self.ensure_dir(self.outputdir)
            self.writePlotsToFile = True
            for format in self.formats:
                self.outdirs[format] = self.outputdir
                self.ensure_dir(self.outdirs[format])
        else:
            self.writePlotsToFile = False

        self.columnData = list()
        self.xticks = list()
        self.yErrorData = list()
        self.rects = list()

        self.fig = plt.figure()
        self.ax = self.fig.add_subplot(111)

        plt.rcParams['figure.subplot.bottom'] = 0.15
        plt.rcParams['figure.subplot.top'] = 0.85
        plt.rcParams['figure.subplot.left'] = 0.15
        plt.rcParams['figure.subplot.right'] = 0.85
        plt.rcParams['font.size'] = 18
        plt.rcParams['lines.linewidth'] = 3.0
        plt.rcParams['axes.grid'] = True
        plt.rcParams['patch.linewidth'] = 2.0

    def setParameter(self, name, value):
        plt.rcParams[name] = value

    def addPlotXY(self, xydata, xlabel="X", ylabel="Y", color='blue', lineStyle="-", legendLabel="", legendPos="upper right", scale="", xrange=None, yrange=None, pointStyle="None"):

        if xrange is not None:
            plt.xlim(xrange)

        if yrange is not None:
            plt.ylim(yrange)

        if scale == "log":
            fig = plt.figure()
            ax = fig.add_subplot(111)
            ax.set_yscale('log')
            ax.set_xscale('log')
        plt.xlabel(xlabel)
        plt.ylabel(ylabel)

        plt.plot(xydata.x, xydata.y, color, label=legendLabel,
                 linestyle=lineStyle, marker=pointStyle, zorder=10)
        if legendPos != "":
            l = plt.legend(loc=legendPos)
            l.set_zorder(50)

    # a plot with multiple graphs stacked, each with its own y-axis
    # @param dataset: a MultiColDataset, first list is x, all others are y-axes
    # @param datasetLabels: a List of MultiColDatasets, each dataset containing y-values and their corresponding Labels for one subpolot
    # @param yranges: a list of lists with the min and the max value for each y-axis
    def addPlotStackedXY(self, dataset, datasetLabels=[], yranges=[], xlabel="X", ylabels=["y1", "y2"]):
        plt.subplots_adjust(hspace=0.2)

        gs = gridspec.GridSpec(
            dataset.getLen() - 1, 1, height_ratios=[1.5, 1, 1, 1])

        ax = []

        for i in range(0, dataset.getLen() - 1):
            if i == 0:
                ax.append(plt.subplot(gs[i]))
            else:
                ax.append(plt.subplot(gs[i], sharex=ax[0]))

            ax[i].plot(
                dataset.getListForIndex(0), dataset.getListForIndex(i + 1))

            if len(datasetLabels) > i:
                plt.yticks(datasetLabels[i].getListForIndex(
                    0), datasetLabels[i].getListForIndex(1))
            if len(yranges) > i:
                plt.ylim(yranges[i][0], yranges[i][1])
            if len(ylabels) > i:
                plt.ylabel(ylabels[i])

        for i in range(0, dataset.getLen() - 1):
            if i == 0:
                xtickslabels = ax[i].get_xticklabels()
            else:
                xtickslabels = xtickslabels + ax[i].get_xticklabels()

        plt.setp(xtickslabels, visible=False)
        plt.xlabel(xlabel)

    def addPlotMulticolXY(self, xdata, ydata, xlabel="X", ylabel="Y", color='r', lineStyle="-", legendLabel="", legendPos="", scale="", xrange=None, yrange=None, pointStyle="None"):

        plt.xlabel(xlabel)
        plt.ylabel(ylabel)
        plt.plot(xdata, ydata, color, label=legendLabel,
                 linestyle=lineStyle, marker=pointStyle)

        if scale == "log":
            fig = plt.figure()
            ax = fig.add_subplot(111)
            ax.set_yscale('log')

        if xrange is not None:
            plt.xlim(xrange)

        if yrange is not None:
            plt.ylim(yrange)

        if legendPos != "":
            plt.legend(loc=legendPos)

    def addPlotXYwithErrorBar(self, xdata, ydata, yerr, xerr, xlabel="X", ylabel="Y", lineStyle="-", legendLabel="", legendPos="", scale="", xrange=None, yrange=None, **kwargs):

        plt.xlabel(xlabel)
        plt.ylabel(ylabel)
        lines = plt.errorbar(
            xdata, ydata, yerr=yerr, xerr=xerr, label=legendLabel, linestyle=lineStyle, **kwargs)

        if scale == "log":
            self.getAxes().set_yscale('log')

        if xrange is not None:
            plt.xlim(xrange)

        if yrange is not None:
            plt.ylim(yrange)

        if legendPos != "":
            plt.legend(loc=legendPos)

        return lines

    def addPlotMulticolXYWithAnnotation(self, xdata, ydata, adata, xlabel="X", ylabel="Y", color='blue', lineStyle="-", lineWidth="0.1", legendLabel="", legendPos="", scale="", xrange=None, yrange=None, pointStyle="None"):
        plt.xlabel(xlabel)
        plt.ylabel(ylabel)
        plt.plot(xdata, ydata, color, label=legendLabel,
                 linestyle=lineStyle, marker=pointStyle, linewidth=lineWidth)

        for i in range(len(adata)):
            plt.annotate(
                adata[i], xy=(xdata[i], ydata[i]), xytext=(xdata[i], ydata[i]))

        if scale == "log":
            fig = plt.figure()
            ax = fig.add_subplot(111)
            ax.set_yscale('log')

        if xrange is not None:
            plt.xlim(xrange)

        if yrange is not None:
            plt.ylim(yrange)

        if legendPos != "":
            plt.legend(loc=legendPos)

    def plotTest(self):
        plt.plot([1, 2, 3, 4])
        plt.plot([3, 4, 5, 7])
        plt.show()

    def ensure_dir(self, f):
        if not os.path.exists(f):
            os.makedirs(f)
            print("Creating directory: ", f)
        # else:
            # shutil.rmtree(f)
            # os.makedirs(f)

    def plotFileAlreadyThere(self, name):
        for frmt in self.formats:
            outdir = self.outdirs[frmt]
            if not os.path.isfile(outdir + os.sep + name.replace(' ', '_') + '.' + frmt):
                return False
        return True

    def plotCDF(self, sampleData, xlabel="X", ylabel="P[x<=X]", color='r', lineStyle="-", legendLabel="", legendPos="lower right", xrange=None, yrange=None, pointStyle="None"):

        #        data = sorted(sampleData)
        #        data_len = len(data)
        #        if data_len == 0:
        #            print("no data to plot")
        #            return
        #        cdf = np.arange(data_len + 1) / data_len
        # to have cdf up to 1
        #        data.append(data[-1])

        numberOfBins = len(sampleData)
        if numberOfBins == 0:
            print("no data to plot")
            return
        rangeStart = float(min(sampleData))
        rangeStop = float(max(sampleData))
        counts, bin_edges = np.histogram(
            a=sampleData, range=(rangeStart, rangeStop), bins=numberOfBins, normed=False)

        cdf = np.cumsum(counts)
        scale = 1.0 / cdf[-1]
        ncdf = cdf * scale
        plt.xlabel(xlabel)
        plt.ylabel(ylabel)
        x = bin_edges[1:]
        first = x[0]
        x = np.insert(x, 0, [first])
        ncdf = np.insert(ncdf, 0, [0])
        plt.plot(x, ncdf, color, label=legendLabel,
                 linestyle=lineStyle, marker=pointStyle)

        if legendPos != "":
            plt.legend(loc=legendPos)

        if xrange is not None:
            plt.xlim(xrange)

        if yrange is not None:
            plt.ylim(yrange)

        # plt.savefig(self.outputdir + name)

    def boxplot(self, values, xlabels=None, xlabel=None, ylabel=None, title=None, width=0.35):
        ind = np.arange(len(values))
        plt.boxplot(values, positions=ind, widths=width)
        if xlabels is not None:
            plt.xticks(ind, xlabels)
        if ylabel is not None:
            plt.ylabel(ylabel)
        if xlabel is not None:
            plt.xlabel(xlabel)
        if title is not None:
            plt.title(title)

    def addBarPlot(self, colData=None, yErrorData=None, xlabel="XLabel", xTickLabel="", ylabel="YLabel", legendPos="", hatching=False, fillBar=True, colors="Default", yrange=None):

        self.columnData.append(colData)
        self.xticks.append(xTickLabel)
        self.yErrorData.append(yErrorData)

        fig = plt.figure()
        # axes = fig.axes.set_size("large")

        ax = fig.add_subplot(111)
        rects = list()
        width = 0.6
        # if (len(self.columnData) != 0):
        # width = 1.0 / len(self.columnData)

        if colors == "Default":
            colors = self.colors

        ind = np.arange(len(self.columnData))
        # ax.set_size("large")
        for i in range(len(self.columnData)):
            if hatching:
                rect = ax.bar(i + (1 - width) / 2, height=self.columnData[i], width=width, color=colors[
                              i], ecolor="black", yerr=self.yErrorData[i], fill=fillBar, hatch=self.hatches[i])
                rects.append(rect)
            else:
                rect = ax.bar(i + (1 - width) / 2, height=self.columnData[i], width=width, color=colors[
                              i], ecolor="black", yerr=self.yErrorData[i], fill=fillBar)
                rects.append(rect)

        ax.set_ylabel(ylabel)
        plt.xlabel(xlabel)
        ax.set_xticklabels(self.xticks)
        ax.set_xticks(ind + 0.5)

        ax.yaxis.grid(linestyle='dotted')
        ax.xaxis.grid(linestyle='None')

        for t in self.ax.xaxis.get_major_ticks():
            t.tick1On = False
            t.tick2On = False

        if yrange is not None:
            plt.ylim(yrange)

        if legendPos != "None":
            ax.legend((rects), self.xticks, loc=legendPos)

        def autolabel(rects):
            # attach some text labels
            for rect in rects:
                height = rect.get_height()
                ax.text(rect.get_x() + rect.get_width() / 2., 1.05 * height, '%d' % int(height),
                        ha='center', va='bottom')

    # this method adds a stacked bar to a stacked bar plot
    # coldata contains a list o    f all values to be plotted for a single stack
    # multiple stacks form the stacked bar plot
    def addStackedBarPlot(self, colData=None, yErrorData=None, xlabel="XLabel", xTickLabel="", ylabel="YLabel", legendPos="", legendLabels=[], hatching=False, fillBar=True, colorBar="w", yrange=None):

        # this met
        self.columnData.append(colData)
        self.xticks.append(xTickLabel)
        self.yErrorData.append(yErrorData)

        fig = plt.figure()
        # axes = fig.axes.set_size("large")

        ax = fig.add_subplot(111)
        rects = list()

        # set width to default
        width = 0.35
        # revise width of single stack if number of data rows is unequal zero
        if len(self.columnData) != 0:
            width = 1.0 / len(self.columnData)

        ind = np.arange(len(self.columnData))
        # ax.set_size("large")
        for i in range(len(self.columnData)):
            stackedData = self.columnData[i]
            stackedYerror = self.yErrorData[i]
            heightFromBottom = 0
            for j in range(len(self.columnData[i])):
                if hatching:
                    rect = ax.bar(i, height=stackedData[j], bottom=heightFromBottom, width=width, color=colorBar, ecolor="black", yerr=stackedYerror[
                                  j], fill=fillBar, hatch=self.hatches[j])
                    heightFromBottom += stackedData[j]
                    if i == 0:
                        rects.append(rect)
                else:
                    rect = ax.bar(i, height=stackedData[
                                  j], bottom=heightFromBottom, width=width, color=colorBar, ecolor="black", yerr=stackedYerror[j], fill=fillBar)
                    heightFromBottom += stackedData[j]
                    if i == 0:
                        rects.append(rect)
                        # rect = ax.bar(i, height=stackedData[j], width=width, color=self.colors[j], ecolor="black", yerr=stackedYerror[j])
                        # add to rects array only to first rect as it will be
                        # needed for later labeling
                    # else:
                    #    rect = ax.bar(i, height=stackedData[j], bottom=stackedData[j-1], width=width, color=self.colors[j], ecolor="black", yerr=stackedYerror[j])

        ax.set_ylabel(ylabel)
        plt.xlabel(xlabel)
        ax.set_xticklabels(self.xticks)
        ax.set_xticks(ind + width / 2)

        if yrange is not None:
            plt.ylim(yrange)

        if legendPos != "None":
            ax.legend((rects), legendLabels, loc=legendPos)

        def autolabel(rects):
            # attach some text labels
            for rect in rects:
                height = rect.get_height()
                ax.text(rect.get_x() + rect.get_width() / 2., 1.05 * height, '%d' % int(height),
                        ha='center', va='bottom')

    def addGroupedBarPlot(self, colData=None, yErrorData=None, xlabel="XLabel", xTickLabels=None, groupNames=None, ylabel="YLabel", legendPos="", hatching=False, fillBar=True, xtickRotation=0, xtickAlignment="center", xrange=None, yrange=None, scale=""):
        width = 0.8
        ind = np.arange(len(colData))

        if hatching:
            rect = self.ax.bar(ind + self.count * width / len(groupNames) + (1 - width) / 2, height=colData, width=width / len(
                groupNames), color=self.colors[self.count], ecolor="black", yerr=yErrorData, fill=fillBar, hatch=self.hatches[self.count])
            self.rects.append(rect[len(rect) - 1])
        else:
            rect = self.ax.bar(ind + self.count * width / len(groupNames) + (1 - width) / 2, height=colData, width=width / len(
                groupNames), color=self.colors[self.count], ecolor="black", yerr=yErrorData, fill=fillBar)
            self.rects.append(rect[len(rect) - 1])

        self.ax.set_ylabel(ylabel)
        plt.xlabel(xlabel)
        self.ax.yaxis.grid(linestyle='dotted')
        self.ax.xaxis.grid(linestyle='None')
        self.ax.set_xticklabels(
            xTickLabels, horizontalalignment=xtickAlignment)
        self.ax.set_xticks(ind + 0.5)
        plt.xlim(0, len(colData))

        labels = self.ax.get_xticklabels()
        for label in labels:
            label.set_rotation(xtickRotation)

        for t in self.ax.xaxis.get_major_ticks():
            t.tick1On = False
            t.tick2On = False

        if legendPos != "None":
            self.ax.legend((self.rects), groupNames, loc=legendPos)

        if scale == "log":
            self.ax.set_yscale('log')

        self.count += 1

        if xrange is not None:
            plt.xlim(xrange)

        if yrange is not None:
            plt.ylim(yrange)

        self.ax.set_axisbelow(True)

    def savePlot(self, name="output.eps"):
        if not self.writePlotsToFile:
            return

        for format in self.formats:
            outdir = self.outdirs[format]
            name = name.replace(' ', '_')  # latex does not like spaces
            plt.savefig(
                outdir + os.sep + name + '.' + format, bbox_inches="tight", pad_inches=0.2)

    def nextPlot(self):
        plt.clf()
        self.columnData = list()
        self.xticks = list()
        self.yErrorData = list()
        self.fig = plt.figure()
        self.ax = self.fig.add_subplot(111)
        self.count = 0

    def getPlotter(self):
        return plt

    def getAxes(self):
        return self.ax

    def getFigure(self):
        return self.fig

    def getOutputDir(self):
        return self.outputdir
