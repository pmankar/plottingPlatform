#!/usr/bin/env python

from query.pollers import ConnectionPoller
from query import numeric


class Poller(ConnectionPoller):
    query_type = "edge"
    query_name = "chord"
    data = {}

    def handle(self, rows):
        for row in rows:
            datakey = row[0] + "=>" + row[1]
            if datakey not in self.data:
                self.data[datakey] = {"source": row[0], "target": row[1], "values": []}
            self.data[datakey]["values"].append(row[2])

    def evaluate(self):
        return [{"source": self.data[key]["source"], "target": self.data[key]["target"], "value": numeric.mean_confidence_width(self.data[key]["values"], confidence=0.95)[0]} for key in self.data]
