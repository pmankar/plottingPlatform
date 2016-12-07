#!/usr/bin/env python3


def getExperiments(connection):
    return connection.query("experiments")


def getExperimentIds(connection, experiment_string, seeds):
    # Ugly hack, but acceptable imho
    seeds = list(map(int, seeds))
    return [id for id, name, seed in getExperiments(connection) if name == experiment_string and seed in seeds]


def getMetrics(connection, eid):
    return connection.query("metrics", {"$eid": eid})
