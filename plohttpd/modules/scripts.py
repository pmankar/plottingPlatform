#!/usr/bin/env python

import os.path
import glob


def getScriptsModule(http_root):
    def _module(data):
        return sorted([os.path.relpath(filename, http_root) for filename in glob.glob(os.path.join(http_root, data["directory"], "*.js"))])
    return _module
