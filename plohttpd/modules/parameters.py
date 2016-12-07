#!/usr/bin/env python3

import query.experiment
from plohttpd.httpd import ApplicationException
import re


def getParametersModule(settings, connection):
    experiments = query.experiment.getExperiments(connection)
    experiment_strings = list(set([name for id, name, seed in experiments]))

    def get_parameter_values(experiment_string):
        parameters = re.findall("\{[A-Za-z_]*\}", experiment_string)
        if not parameters:
            if experiment_string not in experiment_strings:
                raise ApplicationException(message="Experiment does not exist")
            return ({}, [experiment_string])
        parameter_values = {}
        strings = []
        experiment_string_regex = re.compile("^" + re.compile('|'.join(sorted(parameters, reverse=True))).sub(lambda x: "([^\s]+)", experiment_string) + "$")
        for string in experiment_strings:
            matches = experiment_string_regex.match(string)
            if matches is not None:
                strings.append(string)
                values = list(matches.groups())
                for i in range(len(values)):
                    if parameters[i] not in parameter_values:
                        parameter_values[parameters[i]] = []
                    parameter_values[parameters[i]].append(values[i])
        for parameter in parameters:
            if parameter not in parameter_values:
                raise ApplicationException(message="Parameter {} could not be resolved".format(parameter))
        return (parameter_values, strings)

    def get_experiment_ids(strings):
        return [id for id, name, seed in experiments if name in strings]

    def get_experiment_metrics(strings):
        eids = get_experiment_ids(strings)
        metrics = set()
        for eid in eids:
            experiment_metrics = set([name for name, unit in query.experiment.getMetrics(connection, eid)])
            if len(metrics) == 0:
                metrics = experiment_metrics
            else:
                metrics = experiment_metrics & metrics
        return metrics

    def _getParameters(data):
        experiment_string = data["string"]
        parameter_values, strings = get_parameter_values(experiment_string)

        seeds = set()
        for experiment in experiments:
            if experiment[1] in strings:
                seeds.add(experiment[2])
        seeds = list(seeds)

        try:
            annotations = [annotation for annotation, in connection.query("annotations", {"$eids": ','.join(map(str, get_experiment_ids(strings)))})]
        except:
            annotations = []

        parameters = []
        for parameter in parameter_values:
            parameters.append({
                "name": parameter[1:-1],
                "values": sorted(list(set(parameter_values[parameter])))
            })

        metrics = []
        for metric in get_experiment_metrics(strings):
            m = {"metric": metric, "title": metric}
            if "plohttpd" in settings and "metrics" in settings["plohttpd"] and type(settings["plohttpd"]["metrics"]) is list and metric in settings["plohttpd"]["metrics"]:
                m.update(settings["plohttpd"]["metrics"][metric])
            metrics.append(m)

        return {"seeds": seeds, "annotations": annotations, "parameters": parameters, "metrics": metrics}

    return _getParameters
