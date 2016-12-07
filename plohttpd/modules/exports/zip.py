#!/usr/bin/env python3

import os
import os.path
import json
import shutil


def create_handle_zip(formats):
    def _handle_zip(data, destination_filename):
        tmp_dir = destination_filename + "-tmp"

        os.makedirs(tmp_dir)
        for name, item_data in json.loads(data).items():
            for extension in formats:
                formats[extension](item_data, os.path.join(tmp_dir, name + "." + extension))
        shutil.make_archive(destination_filename[:-4], "zip", tmp_dir)
        shutil.rmtree(tmp_dir)
    return _handle_zip
