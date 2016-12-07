#!/usr/bin/env python3

from socketserver import ThreadingMixIn
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os.path
import json
import urllib.parse


class ApplicationException(Exception):
    message = "Unknown Error"

    def __init__(self, **kwargs):
        if "message" in kwargs:
            self.message = kwargs["message"]

    def data(self):
        return {"result": "error", "message": self.message}


class RequestHandler(SimpleHTTPRequestHandler):
    """Available Content-Decoders. Will be selected based on Content-Type-Header"""
    DECODERS = {
        "application/x-www-form-urlencoded": urllib.parse.parse_qs,
        "application/json": json.loads
    }

    """Available Content-Encoders. Will be selected based on file-extension (including leading dot)"""
    ENCODERS = {
        ".json": {"mime": "application/json", "encoder": json.dumps},
    }

    # Override default translation-method, so we can use do_GET and do_HEAD from SimpleHTTPRequestHandler
    def translate_path(self, path):
        return os.path.join(self.server.http_root, path[1:])

    def send_response_fields(self, format, data, coding="utf-8"):
        try:
            encoder = self.ENCODERS[format]
        except KeyError:
            self.send_response(400)
            self.send_header("Content-Type", "text/html; charset={0}".format(coding))
            self.end_headers()
            self.wfile.write("<h1>Unknown Output format</h1>".encode(coding))
            return

        self.send_response(200)
        self.send_header("Content-Type", "{0}; charset={1}".format(encoder["mime"], coding))
        self.end_headers()
        self.wfile.write(encoder["encoder"](data).encode(coding))

    def read_post_fields(self):
        try:
            length = int(self.headers.get("content-length"))
        except (TypeError, ValueError):
            return {}
        content = self.rfile.read(length).decode("utf-8")
        try:
            content_type = self.headers.get("content-type").split(";", 2)[0]
            return self.DECODERS[content_type](content)
        except KeyError:
            raise ApplicationException(code=400, message="Content-Type unsupported")
        except ValueError:
            raise ApplicationException(code=400, message="Content not parseable")

    def do_GET(self):
        # Allow Paths to contain query-string
        self.path = urllib.parse.urlparse(self.path).path
        SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        (module, ext) = os.path.splitext(self.path)
        try:
            if module not in self.server.modules:
                raise ApplicationException(code=404, message="Module not registered")

            response = self.server.modules[module](self.read_post_fields())
            if "result" not in response:
                response = {"result": "ok", "response": response}
            self.send_response_fields(ext, response)
        except ApplicationException as e:
            self.send_response_fields(ext, e.data())


class ApplicationServer(ThreadingMixIn, HTTPServer):
    def __init__(self, http_root, listen=('127.0.0.1', 8080), modules={}):
        self.http_root = http_root
        self.modules = modules
        HTTPServer.__init__(self, listen, RequestHandler)

    def add_module(self, uri, callback):
        self.modules[uri] = callback
