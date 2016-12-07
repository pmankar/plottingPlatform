#!/usr/bin/env python3

from subprocess import call
from plohttpd.httpd import ApplicationException
import os


def handle_pdf(data, destination_filename):
    tmp_file = destination_filename + ".svg"

    open(tmp_file, "w").write(data)
    try:
        call(["inkscape", "-D", "-z", "--file", tmp_file, "--export-pdf", destination_filename])
    except Exception:
        raise ApplicationException(message="Could not convert to pdf. Maybe inkscape is missing?")
    os.unlink(tmp_file)
