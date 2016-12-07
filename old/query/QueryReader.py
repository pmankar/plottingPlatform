import os
'''
Created on 01.07.2011

@author: christian
'''


class QueryReader:

    queries = None
    path = None

    printOutput = True

    def __init__(self, printQueries=True):
        self.queries = dict()
        self.printOutput = printQueries
        self.path = os.path.normpath(
            os.path.join(os.path.dirname(__file__), ".."))

    def getQuery(self, queryName, args):
        tempPath = os.path.normpath(os.path.join(self.path, queryName))
        f = open(tempPath, 'r')
        query = f.read()
        keys = args.keys()
        for key in keys:
            query = query.replace(key, args[key])

        if (self.printOutput):
            print(query + "\n\n")
        return query

    def setPath(self, path):
        self.path = os.path.normpath(os.path.join(self.path, path))
