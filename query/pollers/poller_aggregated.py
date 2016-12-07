#!/usr/bin/env python

from query.pollers import ConnectionPoller
from query import numeric


class Poller(ConnectionPoller):
    query_name = "aggregated"
    data = []

    def handle(self, rows):
        self.data.append(rows[0][0])

    def evaluate(self):
        avg, err = numeric.mean_confidence_width(self.data, confidence=0.95)
        return {"avg": avg, "err": err}
