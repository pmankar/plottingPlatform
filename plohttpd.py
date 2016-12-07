#!/usr/bin/env python3

from query.database import Connection

from plohttpd.httpd import ApplicationServer
from plohttpd.modules.scripts import getScriptsModule
from plohttpd.modules.experiments import getExperimentsModule, getExperimentListModule
from plohttpd.modules.parameters import getParametersModule
from plohttpd.modules.query import getQueryDataModule
from plohttpd.modules.export import getExportModule

import sys
import yaml
import json
import os.path

settingsfile = "settings.yaml"
if len(sys.argv) > 1:
    settingsfile = sys.argv[1]

print("Loading Settings from {}...".format(settingsfile))

import_plot = None
if len(sys.argv) > 2:
    import_plot = json.load(open(sys.argv[2], 'r'))
    print("Using {} as importfile".format(sys.argv[2]))

settings = yaml.load(open(settingsfile, "r"))
root_dir = os.path.dirname(os.path.realpath(__file__))

connection = Connection(**settings["database"])
http_root = os.path.join(root_dir, "plohttpd", "interface")
http_server = ApplicationServer(http_root)
http_server.add_module("/scripts", getScriptsModule(http_root))
http_server.add_module("/experiments", getExperimentsModule(settings, connection, import_plot))
http_server.add_module("/experiment_list", getExperimentListModule(settings, connection))
http_server.add_module("/parameters", getParametersModule(settings, connection))
http_server.add_module("/query", getQueryDataModule(settings, connection))
http_server.add_module("/export", getExportModule(http_root))
print("Server started, listening on port 8080 ...")
http_server.serve_forever()
