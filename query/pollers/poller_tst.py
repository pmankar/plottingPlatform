#!/usr/bin/env python

from query.pollers import ConnectionPoller


class Poller(ConnectionPoller):
    # specify which query should be used. look for query/sql/transit/single_example.sql to find this one.
    query_name = "tst"
    data = []

    def handle(self, rows):
        # receive result of the sql-statement. Will be called once per experiment (one statement per experiment-id). Store results internally as needed.
        # rows will be a two-dimensional-array: first dimension row-number, second-dimension column-number. You have to know which column-number represents which column on your own (know your query!)
        # as we know our query will only return one line, omit one level of hierarchy
        self.data.append(rows)
        #self.data = self.data + [row[0] for row in rows]

    def evaluate(self):
        # Use internally stored data for return. Here is the last place to aggregate the numbers before they get send to the client
        return {"tst_data": self.data}
