#!/usr/bin/env python

from query.metric import Metric


def experiment_string_replace(experimentString, parameter, value):
    return experimentString.replace("{" + parameter + "}", value)


def insert_static_parameters(experimentString, parameters):
    newParameters = []
    for parameter in parameters:
        if parameter["value"]["type"] == "static":
            experimentString = experiment_string_replace(experimentString, parameter["name"], parameter["value"]["value"])
        else:
            newParameters.append(parameter)
    return (experimentString, newParameters)


def create_struct_query(experimentString, parameters):
    if not parameters:
        return experimentString

    query = {}
    for i in range(len(parameters)):
        parameter = parameters[i]
        newParameters = parameters[:i] + parameters[i + 1:]
        query[parameter["value"]["label"]] = {"parameter": parameter}
        if parameter["value"]["type"] == "distinct":
            query[parameter["value"]["label"]]["values"] = [{
                "label": value["label"],
                "query": create_struct_query(experiment_string_replace(experimentString, parameter["name"], value["value"]), newParameters)
            } for value in parameter["value"]["value"]]
    return query


def get_experiment_strings(query):
    if isinstance(query, str):
        return [query]
    return sum([sum([get_experiment_strings(parameter["query"]) for parameter in query[item]["values"]], []) for item in query], [])


def parse_query(data):
    experimentString, parameters = insert_static_parameters(data["experiment"], data["parameters"])
    query = create_struct_query(experimentString, parameters)
    experiment_strings = list(set(get_experiment_strings(query)))
    metrics = {}
    for metric_key in data["metrics"]:
        metrics[metric_key] = Metric(**data["metrics"][metric_key])
    return (query, experiment_strings, metrics)
