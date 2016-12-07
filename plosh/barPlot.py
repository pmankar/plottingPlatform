#!/usr/bin/env python3

import matplotlib.pyplot as plt
import numpy


class Visualisation():
    colors = ['#005AA9', '#F5A300', '#009D81', '#E6001A', '#A60084', 'green']

    def __init__(self, **options):
        self.__dict__.update(options)

    def visualize(self, result, updateStatus):
        axis = result["query"]["X-Axis"]
        labels = [x["label"] for x in axis["values"]]

        plt.rcParams['figure.subplot.bottom'] = 0.15
        plt.rcParams['figure.subplot.top'] = 0.85
        plt.rcParams['figure.subplot.left'] = 0.15
        plt.rcParams['figure.subplot.right'] = 0.85
        plt.rcParams['font.size'] = 18
        plt.rcParams['lines.linewidth'] = 3.0
        plt.rcParams['axes.grid'] = True
        plt.rcParams['patch.linewidth'] = 2.0

        fig = plt.figure()
        ax = fig.add_subplot(111)
        rects = []
        width = 0.6

        ind = numpy.arange(len(axis["values"]))
        for i in ind:
            id = axis["values"][i]["query"]
            value = result["values"][id]["aggregated"]
            rects.append(ax.bar(i + (1 - width) / 2, height=value["avg"], width=width, color=self.colors[i % len(self.colors)], ecolor="black", yerr=value["err"], fill=True))

        ax.set_ylabel(result["metric"]["title"])
        plt.xlabel(axis["parameter"]["parameter"])
        ax.set_xticklabels(labels)
        ax.set_xticks(ind + 0.5)

        if result["metric"]["valueRange"] is not None:
            plt.ylim(result["metric"]["valueRange"])

        ax.yaxis.grid(linestyle="dotted")
        ax.xaxis.grid(linestyle="None")

        for t in ax.xaxis.get_major_ticks():
            t.tick1On = False
            t.tick2On = False

        plt.savefig("test.pdf", bbox_inches="tight", pad_inches=0.2)
