'''
Created on 05.10.2012

@author: Bjoern
'''

import os
from plotter.Plotter import Plotter
from util.NumericToolBox import NumericToolBox
from query.QueryReader import QueryReader
from util.datasets.GroupedXYDataset import GroupedXYDataset


class Evaluation:

    parameters = list()
    metrics = list()
    name = ''
    greyscale = False
    formats = set(['pdf'])
    colors = ['#005AA9', '#009D81', '#F5A300', '#E6001A', '#A60084', 'green']
    # ['solid', 'dashed', 'dotted', '-.', 'dashed', 'dotted', 'solid', '-.']
    lines = ['-', '-', '-', '-', '-', '-']
    markers = ['^', 'o', 's', 'p', 'o', 'x']
    queryReader = QueryReader(printQueries=False)

    def __init__(self, name, parameters, metrics, path, dbConnector, resetDBCache=False):
        self.parameters = parameters
        self.metrics = metrics
        self.name = name
        self.path = path
        self.dbConnector = dbConnector

    def runPlotting(self, experimentIDSelector, dbConnector):
        for p in self.parameters:
            ids = experimentIDSelector.getIdsForParameter(p, dbConnector)
            idx = 0
            # Building experiments-list
            experiments = list()
            for v in p.variations:
                vids = ids[idx]
                experiment = (v, vids, p.labels[idx], p.title)
                experiments.append(experiment)
                idx = idx + 1

            print('Creating Plots for ' + p.title)
            print(str(experiments))

            if len(self.parameters) == 1:
                plotter = Plotter(
                    outputdir='output/' + self.name, greyscale=self.greyscale, formats=self.formats)
            else:
                plotter = Plotter(outputdir='output/transit/' + self.name +
                                  '/' + p.name, greyscale=self.greyscale, formats=self.formats)

            self.createCDFSingleMetric(plotter, experiments, self.metrics)
            self.createBarplotSingleMetric(plotter, experiments, self.metrics)
            self.createTimePlotSingleMetric(plotter, experiments, self.metrics)
            # self.createCDFSingleMetricTimeintervals(plotter, experiments, self.metrics)
            self.createBoxplotSingleMetric(plotter, experiments, self.metrics)

    def getInvalidHostIds(self, eid):
        # invalidHosts = dbConnector.queryMultiCol(self.queryReader.getQuery("transit/sql/invalid_hostids.sql", {'$eid':str(eid)})).getListForIndex(0);
        strh = "0,1,2,3,4"  # Exclude Sources and Tracker!
        # if invalidHosts is None:
        #    return strh
        #
        # for h in invalidHosts:
        #    strh += ','
        #    strh += str(h)
        return strh

    def createCDFSingleMetric(self, plotter, experiments, metrics):
        nt = NumericToolBox()
        for m in metrics:
            if not m.plotCDF:
                continue
            i = 0
            name = 'CDF_' + m.title
            if plotter.plotFileAlreadyThere(name):
                continue
            print("Plotting CDF: " + m.name + "...")
            for e in experiments:
                resultData = list()
                for run in e[1]:
                    dataset = list()
                    if os.path.exists(self.path + m.query + "_per_host.sql"):
                        args = {'$eid': str(run), '$metric': m.name, '$scale': str(m.valueScale), '$mintime': '3600*1000000*1',
                                '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run), '$mincount': str(m.minCount)}
                        dataset = self.dbConnector.queryMultiCol(
                            self.queryReader.getQuery("transit/sql/" + m.query + "_per_host.sql", args))
                    else:
                        args = {'$eid': str(run), '$metric': m.name, '$scale': str(m.valueScale), '$mintime': '3600*1000000*1',
                                '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run), '$mincount': str(m.minCount)}
                        dataset = self.dbConnector.queryMultiCol(
                            self.queryReader.getQuery("transit/sql/single_per_host.sql", args))
                    if dataset.getListForIndex(0) is not None:
                        resultData.extend(dataset.getListForIndex(0))
                # resultData = nt.removeOutliersUsingMean(resultData, flexibility=3)
                if m.valueRange is not None:
                    resultData = nt.removeOutliersUsingMedian(
                        resultData, flexibility=3)
                plotter.plotCDF(sampleData=resultData, xlabel=m.title + m.unit, ylabel=r'$P\,\left[X \leq x\right]$', color=self.colors[
                                i], lineStyle='-', legendLabel=e[2], legendPos=m.legendPos, xrange=m.valueRange, yrange=None, pointStyle='None')
                i = i + 1
            plotter.savePlot(name)
            plotter.nextPlot()

    def createBoxplotSingleMetric(self, plotter, experiments, metrics):
        for m in metrics:
            if m.plotBox is None:
                continue
            i = 0
            name = 'BOX_' + m.title
            if plotter.plotFileAlreadyThere(name):
                continue
            print("Plotting BOX: " + m.name + "...")
            data = list()
            labels = list()
            for e in experiments:
                resultData = list()
                for run in e[1]:
                    dataset = list()
                    if os.path.exists(self.path + m.query + "_per_host.sql"):
                        args = {'$eid': str(run), '$metric': m.name, '$scale': str(m.valueScale), '$mintime': '3600*1000000*1',
                                '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run), '$mincount': str(m.minCount)}
                        dataset = self.dbConnector.queryMultiCol(
                            self.queryReader.getQuery("transit/sql/" + m.query + "_per_host.sql", args))
                    else:
                        args = {'$eid': str(run), '$metric': m.name, '$scale': str(m.valueScale), '$mintime': '3600*1000000*1',
                                '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run), '$mincount': str(m.minCount)}
                        dataset = self.dbConnector.queryMultiCol(
                            self.queryReader.getQuery("transit/sql/single_per_host.sql", args))
                    # resultData.extend(dataset.getListForIndex(0))
                    labels.append(e[2])
                    data.append(dataset.getListForIndex(0))
                # resultData = nt.removeOutliersUsingMean(resultData, flexibility=3)
                # resultData = nt.removeOutliersUsingMedian(resultData, flexibility=3)
                # plotter.plotCDF(sampleData=resultData, xlabel=m.title+m.unit, ylabel=r'$P\,\left[X \leq x\right]$', color=self.colors[i], lineStyle='-', legendLabel=e[2], legendPos=m.legendPos, xrange=m.valueRange, yrange=None, pointStyle='None')
                i = i + 1
            plotter.boxplot(
                data, xlabels=labels, ylabel=m.title + m.unit, xlabel=experiments[0][3])
            plotter.savePlot(name)
            plotter.nextPlot()

    def createCDFSingleMetricTimeintervals(self, plotter, experiments, metrics):
        # nt = NumericToolBox()
        for m in metrics:
            if m.plotCDFIntervals is None:
                continue
            for interval in m.plotCDFIntervals:
                i = 0
                name = 'CDFTI_' + m.title + '_' + \
                    str(interval[0]) + '_' + str(interval[1])
                if plotter.plotFileAlreadyThere(name):
                    continue
                print("Plotting CDF: " + m.name + "...")
                for e in experiments:
                    resultData = list()
                    for run in e[1]:
                        dataset = list()
                        if os.path.exists(self.path + m.query + "_per_host.sql"):
                            args = {'$eid': str(run), '$metric': m.name, '$scale': str(m.valueScale), '$mintime': str(interval[
                                0] * 1000 * 1000 * 60), '$maxtime': str(interval[1] * 1000 * 1000 * 60), '$excludeHosts': self.getInvalidHostIds(run), '$mincount': str(m.minCount)}
                            dataset = self.dbConnector.queryMultiCol(
                                self.queryReader.getQuery("transit/sql/" + m.query + "_per_host.sql", args))
                        else:
                            args = {'$eid': str(run), '$metric': m.name, '$scale': str(m.valueScale), '$mintime': str(interval[
                                0] * 1000 * 1000 * 60), '$maxtime': str(interval[1] * 1000 * 1000 * 60), '$excludeHosts': self.getInvalidHostIds(run), '$mincount': str(m.minCount)}
                            dataset = self.dbConnector.queryMultiCol(
                                self.queryReader.getQuery("transit/sql/single_per_host.sql", args))
                        resultData.extend(dataset.getListForIndex(0))
                        # resultData = nt.removeOutliersUsingMean(resultData, flexibility=2.5)
                    plotter.plotCDF(sampleData=resultData, xlabel=m.title + m.unit, ylabel=r'$P\,\left[X \leq x\right]$', color=self.colors[
                                    i], lineStyle='-', legendLabel=e[2], legendPos=m.legendPos, xrange=m.valueRange, yrange=None, pointStyle='None')
                    i = i + 1
                plotter.savePlot(name)
                plotter.nextPlot()

    def createTimePlotSingleMetric(self, plotter, experiments, metrics):
        for m in metrics:
            if m.plotTime is None:
                continue
            name = 'TIME_' + m.title
            if plotter.plotFileAlreadyThere(name):
                continue
            i = 0
            print("Plotting TIME: " + m.name + "...")

            if "marker" in m.plotTime and m.plotTime['marker']:
                markers = self.markers
            else:
                markers = ['', '', '', '', '', '']

            if "line" in m.plotTime and m.plotTime['line']:
                lines = self.lines
            else:
                lines = ['', '', '', '', '', '']

            plotScenario = False
            if "plotScenario" in m.plotTime and m.plotTime['plotScenario']:
                plotScenario = True

            peersOnline = None

            for e in experiments:
                dataset = GroupedXYDataset()
                for run in e[1]:
                    if peersOnline is None and plotScenario:
                        args = {'$eid': str(run), '$metric': 'Dao_PeersPresent', '$timescale': '60*1000000', '$scale': '1',
                                '$mintime': '3600*1000000*1', '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run)}
                        peersOnline = self.dbConnector.queryXY(
                            self.queryReader.getQuery("transit/sql/single_time.sql", args))

                    if os.path.exists(self.path + m.query + "_time.sql"):
                        args = {'$eid': str(run), '$metric': m.name, '$timescale': '60*1000000', '$scale': str(
                            m.valueScale), '$mintime': '3600*1000000*1', '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run)}
                        dataset = self.dbConnector.queryGroupedXY(
                            self.queryReader.getQuery("transit/sql/" + m.query + "_time.sql", args), dataset)
                    else:
                        args = {'$eid': str(run), '$metric': m.name, '$timescale': '60*1000000', '$scale': str(
                            m.valueScale), '$mintime': '3600*1000000*1', '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run)}
                        dataset = self.dbConnector.queryGroupedXY(
                            self.queryReader.getQuery("transit/sql/single_time.sql", args), dataset)
                    # xdata, ydata, yerr = dataset.getGroupedMeanAndConfidence(0.75, 0.25)
                    # xdata, ydata, yerr = dataset.getGroupedMeanAndMinMax()
                xdata, ydata = dataset.getGroupedMean()
                yerr = None
                plotter.addPlotXYwithErrorBar(xdata, ydata, yerr, None, xlabel="time [h]", ylabel=m.title + m.unit, lineStyle=lines[i],
                                              color=self.colors[i], legendLabel=e[2], marker=markers[i], markeredgecolor=self.colors[i], **m.plotTime['args'])
                plotter.getAxes().xaxis.set_ticks(range(m.plotTime['args']['xrange'][
                    0], m.plotTime['args']['xrange'][1] + 1, 60), minor=False)
                plotter.getAxes().xaxis.set_ticks(range(m.plotTime['args']['xrange'][
                    0] + 30, m.plotTime['args']['xrange'][1], 60), minor=True)

                # Dirty hack to plot the 24h trace
                # plotter.getAxes().xaxis.set_ticks(range(m.plotTime['args']['xrange'][0], m.plotTime['args']['xrange'][1]+1, 60), minor=False)
                # plotter.getAxes().xaxis.set_ticklabels(['0','','2','','4','','6','','8','','10','','12','','14','','16','','18','','20','','22',''])
                # plotter.getFigure().set_figheight(6);
                # plotter.getFigure().set_figwidth(16);
                # End of dirty hack

                i = i + 1

            if peersOnline is not None and plotScenario:
                ax1 = plotter.getAxes()
                ax2 = ax1.twinx()
                ax2.plot(
                    peersOnline.x, peersOnline.y, color='#aaaaaa', alpha=0.5)
                plotter.getPlotter().xlim(m.plotTime['args']['xrange'])
                ax2.yaxis.grid(linestyle='None')
                ax2.yaxis.set_visible(False)
                ax1.set_zorder(ax2.get_zorder() + 1)  # put ax in front of ax2
                ax1.patch.set_visible(False)  # hide the 'canvas'
                ax2.xaxis.set_ticks(range(m.plotTime['args']['xrange'][0], m.plotTime[
                                    'args']['xrange'][1] + 1, 60), minor=False)
                ax2.xaxis.set_ticks(range(m.plotTime['args']['xrange'][
                                    0] + 30, m.plotTime['args']['xrange'][1], 60), minor=True)
            plotter.savePlot(name)
            plotter.nextPlot()

    def createBarplotSingleMetric(self, plotter, experiments, metrics):
        nt = NumericToolBox()
        for m in metrics:
            if not m.plotBar:
                continue
            name = 'BAR_' + m.title
            if plotter.plotFileAlreadyThere(name):
                continue
            print("Plotting BAR: " + m.name + "...")
            metricsLegend = list()
            for e in experiments:
                temp = list()
                metricsLegend.append(e[0])
                for run in e[1]:
                    dataset = list()
                    if os.path.exists(self.path + m.query + "_aggregated.sql"):
                        args = {'$eid': str(run), '$metric': m.name, '$scale': str(m.valueScale), '$mintime': '3600*1000000*1',
                                '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run), '$mincount': str(m.minCount)}
                        dataset = self.dbConnector.queryMultiCol(
                            self.queryReader.getQuery("transit/sql/" + m.query + "_aggregated.sql", args))
                    else:
                        args = {'$eid': str(run), '$metric': m.name, '$scale': str(m.valueScale), '$mintime': '3600*1000000*1',
                                '$maxtime': '3600*1000000*24', '$excludeHosts': self.getInvalidHostIds(run), '$mincount': str(m.minCount)}
                        dataset = self.dbConnector.queryMultiCol(
                            self.queryReader.getQuery("transit/sql/single_aggregated.sql", args))
                    # temp.extend(dataset)
                    temp.append(dataset.getListForIndex(0)[0])
                sthn = nt.mean_confidence_width(temp, confidence=0.95)
                if sthn is not None:
                    print(name + "  average: " + str(sthn[0]) + " err: " + str(
                        sthn[1]) + " of values: " + str(temp) + " with " + str(e[1]) + "/" + str(e[3]))
                    plotter.addBarPlot(colData=sthn[0], yErrorData=sthn[1], xTickLabel=e[2], xlabel=e[
                                       3], ylabel=m.title + m.unit, legendPos='None', hatching=False, colors=self.colors)
            plotter.savePlot(name)
            plotter.nextPlot()
