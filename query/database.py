#!/usr/bin/env python

import mysql.connector
import os.path


class Connection:
    def __init__(self, **kwargs):
        self.conn = mysql.connector.connect(**kwargs)
        self.data_root = os.path.join(os.path.dirname(__file__), "sql")

    def get_filename(self, name):
        return os.path.join(self.data_root, name + ".sql")

    def find_first_queryfile(self, names):
        for name in names:
            file_name = self.get_filename(name)
            if os.path.exists(file_name):
                return file_name
        raise Exception("No queryfile found")

    def query(self, names, args={}):
        if not isinstance(names, list):
            names = [names]

        query = open(self.find_first_queryfile(names), 'r').read()
        for key in args:
            query = query.replace(key, str(args[key]))

        # TODO maybe add caching here - but I don't think it's a good idea (better use mysqls query-cache)
        cursor = self.conn.cursor()
        try:
            cursor.execute(query)
        except mysql.connector.Error as err:
            raise Exception("Database-Exception: {}".format(err))
        rows = cursor.fetchall()

        return rows
