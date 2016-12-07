#!/usr/bin/env python

from plohttpd.httpd import ApplicationException
from plohttpd.modules import process_in_background
from query.handler import handle_query
import traceback


def getQueryDataModule(settings, connection):
    @process_in_background
    def _queryData(data, updateStatus):
        try:
            return handle_query(connection, data, updateStatus)
        except Exception:
            raise ApplicationException(message=traceback.format_exc())
    return _queryData
