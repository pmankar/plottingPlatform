#!/usr/bin/env python3


def handle_plain(data, destination_filename):
    open(destination_filename, "w").write(data)
