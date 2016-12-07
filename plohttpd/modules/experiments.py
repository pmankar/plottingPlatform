#!/usr/bin/env python3

from query.experiment import getExperiments


def getExperimentsModule(settings, connection, plot_data):
    experiments = []
    if "plohttpd" in settings and "experimentStrings" in settings["plohttpd"] and type(settings["plohttpd"]["experimentStrings"]) is dict:
        experiments = [{"name": name, "string": string} for name, string in settings["plohttpd"]["experimentStrings"].items()]

    def _getExperiments(data):
        return {"experiments": experiments, "import": plot_data}
    return _getExperiments


def getExperimentListModule(settings, connection):
    experiment_list = [{"id": experiment[0], "string": experiment[1], "seed": experiment[2]} for experiment in getExperiments(connection)]

    def _getExperimentList(data):
        return experiment_list
    return _getExperimentList
