#!/usr/bin/env python3

from plohttpd.modules import process_in_background
import random
import os.path
import os
import time
from threading import Thread
from plohttpd.modules.exports.pdf import handle_pdf
from plohttpd.modules.exports.plain import handle_plain
from plohttpd.modules.exports.zip import create_handle_zip


export_handlers = {
    "pdf": handle_pdf,
    "svg": handle_plain,
    "json": handle_plain,
    "zip": create_handle_zip({"pdf": handle_pdf, "svg": handle_plain}),
}


def getExportModule(http_root):
    @process_in_background
    def _exportModule(data, updateStatus):
        updateStatus(message="Running export. Your file will be delivered to you automatically")
        destination_file = os.path.join("temp", '%015x' % random.randrange(16 ** 15) + "." + data["format"])
        destination_filename = os.path.join(http_root, destination_file)
        export_handlers[data["format"]](data["data"], destination_filename)

        # Avoid old export-files lying around
        def _removeFile():
            time.sleep(20)
            os.unlink(destination_filename)
        Thread(target=_removeFile).start()

        return {"location": destination_file}

    return _exportModule
