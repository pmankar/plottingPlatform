#!/usr/bin/env python

from query.pollers import ConnectionPoller
import numpy


class Poller(ConnectionPoller):
    query_name = "time"
    data = []

    def handle(self, rows):
        self.data = self.data + rows

    def evaluate(self):
        data_grouped = []
        for x in list(set([row[0] for row in self.data])):
            data_grouped.append({"x": int(x / self.metric.scaleTime), "y": numpy.mean([row[1] for row in self.data if row[0] == x])})
        return data_grouped
