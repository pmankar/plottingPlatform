#!/usr/bin/env python3


class Metric:
    defaults = {
        "metric": None,
        "title": None,
        "query": "single",
        "valueScale": 1,
        "minCount": 1,
        "valueRange": None,
        "scaleTime": 1,
        "pollers": None,
    }

    def __init__(self, **kwargs):
        self.__dict__.update(self.defaults)
        self.__dict__.update(kwargs)

        if self.title is None:
            self.title = self.metric
