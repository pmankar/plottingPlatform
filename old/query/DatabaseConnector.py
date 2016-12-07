'''
Created on 20.05.2011

@author: christian
'''

import MySQLdb
import sys
import os
import pickle
import hashlib
from util.datasets.XYDataset import XYDataset
from util.datasets.MultiColDataset import MultiColDataset


class State:
    UNKNOWN = -1
    INIT = 0
    CONNECTED = 1


class DatabaseConnector:

    conn = None
    state = None
    cachingPath = ""
    useCaching = None
    printOutput = False

    host = ""
    db = ""
    user = ""
    passwd = ""
    port = -1

    def __init__(self, useCaching, printOutput=True):
        if (printOutput):
            print("Initializing database connector")
        self.conn = None
        self.printOutput = printOutput
        self.useCaching = useCaching
        self.state = State.INIT
        if useCaching:
            self.cachingPath = os.path.normpath(
                os.path.join(os.path.dirname(__file__), "../../../queryCache/"))
            self.ensure_dir(self.cachingPath)

    def ensure_dir(self, f):
        if (self.printOutput):
            print("Ensuring directory: ", f)
        if not os.path.exists(f):
            os.makedirs(f)
            print("Creating directory: ", f)

    def checkCache(self, query):

        if (self.printOutput):
            print(query)

        if not self.useCaching:
            return None

        hash = hashlib.md5(
            query + str(self.host) + str(self.db) + str(self.port)).hexdigest()

        # print "checking cache for query hit"
        if os.path.isfile(self.cachingPath + os.sep + hash):
            if (self.printOutput):
                print("Cache hit! " + str(self.cachingPath + os.sep + hash))
            f = open(self.cachingPath + os.sep + hash, 'r')
            return pickle.load(f)
        else:
            return None

    def cacheQuery(self, query, result):
        if not self.useCaching:
            return

        # if (self.printOutput):
        #     print "caching query"
        #     print query
        hash = hashlib.md5(
            query + str(self.host) + str(self.db) + str(self.port)).hexdigest()
        f = open(self.cachingPath + os.sep + hash, 'w')
        pickle.dump(result, f)

    def connectToDb(self, host, user, passwd, db, port):

        try:
            if (self.printOutput):
                print("Connecting to database...")
            self.host = host
            self.user = user
            self.passwd = passwd
            self.db = db
            self.port = port
            self.conn = MySQLdb.connect(
                host=host, user=user, port=port, passwd=passwd, db=db)
            self.state = State.CONNECTED

        except MySQLdb.Error as e:
            print("Error %d: %s" % (e.args[0], e.args[1]))
            sys.exit(1)

    def queryX(self, query):

        if query is None:
            raise Exception('databaseConnector', 'query is none!')

        if self.state == State.CONNECTED:
            rows = self.checkCache(query)
            if rows is None:
                cursor = self.conn.cursor()
                cursor.execute(query)
                rows = cursor.fetchall()
                self.cacheQuery(query, rows)

            data = list()

            if rows is None or len(rows) == 0 or len(rows[0]) != 1:
                # raise Exception('databaseConnector', 'number of Columns unequal 2')
                print("number of Columns unequal 1")
                return data

            for row in rows:
                data.append(row[0])
            return data
        else:
            raise Exception('databaseConnector', 'Not connected to database')

    def queryGroupedXY(self, query, dataset):
        # If you want to plot a XY-metric with multiple Y-values for every x (for example for each host), use this query.
        # For each X (timepoint), you will get a set on which you can calculate
        # mean, std, ...
        if query is None:
            raise Exception('databaseConnector', 'query is none!')

        if (self.state == State.CONNECTED):
            rows = self.checkCache(query)
            if rows is None:
                cursor = self.conn.cursor()
                cursor.execute(query)
                rows = cursor.fetchall()
                self.cacheQuery(query, rows)

            # dataset = GroupedXYDataset()
            # dataset.x = rows[:][:]
            # dataset.y = rows[:][:]
            if rows is None or len(rows) == 0 or len(rows[0]) != 2:
                # raise Exception('databaseConnector', 'number of Columns unequal 2')
                print("number of Columns unequal 2")
                return dataset

            for row in rows:
                dataset.addValue(row[0], row[1])
            return dataset
        else:
            print("Not connected to database")

    def queryXY(self, query):

        if query is None:
            raise Exception('databaseConnector', 'query is none!')

        if self.state == State.CONNECTED:
            rows = self.checkCache(query)
            if rows is None:
                cursor = self.conn.cursor()
                cursor.execute(query)
                rows = cursor.fetchall()
                self.cacheQuery(query, rows)

            dataset = XYDataset()
            # dataset.x = rows[:][:]
            # dataset.y = rows[:][:]
            if rows is None or len(rows) == 0 or len(rows[0]) != 2:
                # raise Exception('databaseConnector', 'number of Columns unequal 2')
                print("number of Columns unequal 2")
                return dataset

            for row in rows:
                dataset.addValueToX(row[0])
                dataset.addValueToY(row[1])
            return dataset
        else:
            print("Not connected to database")

    def querySingleValue(self, query):

        if query is None:
            raise Exception('databaseConnector', 'query is none!')

        if (self.state == State.CONNECTED):
            rows = self.checkCache(query)
            if rows is None:
                cursor = self.conn.cursor()
                cursor.execute(query)
                rows = cursor.fetchall()
                self.cacheQuery(query, rows)

            if (len(rows) >= 1):
                return rows[0][0]
            else:
                return None
            # dataset.x = rows[:][:]
            # dataset.y = rows[:][:]

        else:
            print("Not connected to database")

    def queryMultiCol(self, query, ignoreCache=False):

        if query is None:
            raise Exception('databaseConnector', 'query is none!')

        if (self.state == State.CONNECTED):
            rows = self.checkCache(query)
            if rows is None or ignoreCache:
                cursor = self.conn.cursor()
                cursor.execute(query)
                rows = cursor.fetchall()
                self.cacheQuery(query, rows)

            dataset = MultiColDataset()
            # dataset.x = rows[:][:]
            # dataset.y = rows[:][:]

            for row in rows:
                for i in range(len(row)):
                    dataset.addValueToList(i, row[i])
            # print dataset.x, dataset.y
            return dataset
        else:
            print("Not connected to database")
