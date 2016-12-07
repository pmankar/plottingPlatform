#!/usr/bin/env python


class ConnectionPoller:
    query_type = "single"

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def read(self, connection, eid):
        args = {"$mintime": 3600 * 1000000 * 1, "$maxtime": 3600 * 1000000 * 24, "$timescale": 60 * 1000000, "$excludeHosts": "0,1,2,3,4"}
        args["$eid"] = eid
        args["$metric"] = self.metric.metric
        args["$scale"] = self.metric.valueScale
        args["$mincount"] = self.metric.minCount
        args["$annotations"] = ",".join(["'" + annotation + "'" for annotation in self.annotations])
        self.handle(connection.query(["transit/{}_{}".format(self.metric.query, self.query_name), "transit/{}_{}".format(self.query_type, self.query_name)], args))
