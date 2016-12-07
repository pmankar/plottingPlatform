#!/usr/bin/env python

from query.pollers import ConnectionPoller


class Poller(ConnectionPoller):
    query_name = "per_host"
    data = []

    def handle(self, rows):
        self.data = self.data + [row[0] for row in rows]

    def evaluate(self):
        # if self.metric.valueRange is not None:
        #     data_per_host = numeric.removeOutliers(data_per_host, flexibility=3, deviation=numpy.median)
        return self.data
