#!/usr/bin/env python3

import importlib
import os.path
import glob
import query.experiment
from query.parser import parse_query


def handle_experiment(connection, experiment_string, metric, filter, updateHook):
    poller_names = metric.pollers if metric.pollers else get_available_pollers()
    pollers = {poller_name: load_poller(poller_name)(metric=metric, annotations=filter["annotations"]) for poller_name in poller_names}

    poller_names = list(pollers.keys())
    ids = query.experiment.getExperimentIds(connection, experiment_string, filter["seeds"])
    for i in range(len(ids)):
        for j in range(len(poller_names)):
            poller_name = poller_names[j]
            try:
                pollers[poller_name].read(connection, ids[i])
            except Exception as e:
                print("Error while polling {}: {}".format(poller_name, e))
            updateHook(0.9 * (j / len(poller_names)) * (i / len(ids)))

    results = {}
    for poller_name, poller in pollers.items():
        try:
            results[poller_name] = poller.evaluate()
        except Exception as e:
            print("Error while evaluating {}: {}".format(poller_name, e))
    return results


def get_available_pollers():
    poller_directory = os.path.join(os.path.dirname(__file__), "pollers")
    return [os.path.basename(filename)[7:-3] for filename in glob.glob(os.path.join(poller_directory, "poller_*.py"))]


def load_poller(name):
    return importlib.import_module("query.pollers.poller_{}".format(name)).Poller


def handle_query(connection, data, updateStatus):
    query, experiment_strings, metrics = parse_query(data)
    if len(experiment_strings) == 0:
        raise Exception("Invalid Query: Found 0 experiment Strings")
    updateStatus(message="Parsed Query, found {} experiment Strings".format(len(experiment_strings)), progress=0)
    values = {}
    for i in range(len(experiment_strings)):
        experiment_string = experiment_strings[i]
        updateStatus(message="Loading {}...".format(experiment_string))
        values[experiment_string] = {}
        for metric_label in metrics:
            values[experiment_string][metric_label] = handle_experiment(connection, experiment_string, metrics[metric_label], data["filters"], lambda p: updateStatus(progress=(i + p) / len(experiment_strings)))
        updateStatus(progress=(i + 1) / len(experiment_strings))
    return {"query": query, "metrics": {key: metric.__dict__ for key, metric in metrics.items()}, "values": values}
