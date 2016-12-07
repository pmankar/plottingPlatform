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

        for i in range(len(axis["values"])):
            label = axis["values"][i]["label"]
            experiment_string = axis["values"][i]["query"]

            counts, bin_edges = numpy.histogram(result["values"][experiment_string]["per_host"], bins=len(result["values"][experiment_string]["per_host"]), density=False)
            counts = numpy.cumsum(counts)
            cdf = counts / counts[-1]

            bin_edges = numpy.insert(bin_edges[1:], 0, [bin_edges[0]])
            cdf = numpy.insert(cdf, 0, [0])

            plt.plot(bin_edges, cdf, self.colors[i % len(self.colors)], label=label)

        plt.legend(loc="best")
        plt.xlabel(result["metric"]["title"])
        plt.ylabel(r'$P\,\left[X \leq x\right]$')

        if result["metric"]["valueRange"] is not None:
            plt.xlim(result["metric"]["valueRange"])

#        plt.yaxis.grid(linestyle="dotted")
#        plt.xaxis.grid(linestyle="dotted")

        plt.savefig("test.pdf", bbox_inches="tight", pad_inches=0.2)
