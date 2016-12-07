#!/usr/bin/env python3

from query.database import Connection
from query.handler import handle_query

import sys
import json
import yaml
import os.path
import importlib

root_dir = os.path.dirname(os.path.realpath(__file__))
settings = yaml.load(open(os.path.join(root_dir, "settings.yaml")))
data = json.load(open(sys.argv[1], 'r'))


def updateStatus(**kwargs):
    if "message" in kwargs:
        print(kwargs["message"])

visualisation = data["visualisation"]
connection = Connection(**settings["database"])

if "result" in data:
    result = data["result"]
else:
    result = handle_query(connection, data["query"], updateStatus)

updateStatus(message="Start plotting using {}".format(visualisation["module"]))
Visualisation = importlib.import_module("plosh.{}".format(visualisation["module"])).Visualisation
Visualisation(**visualisation["options"]).visualize(result, updateStatus)
