from query.DatabaseConnector import DatabaseConnector
from transit.evaluations.example import plotExample
from transit.evaluations.evalPQA import plotPQAEval

if __name__ == '__main__':
    dbConnector = DatabaseConnector(False, printOutput=True)


# Select your evaluations here:
n = 1

if n == 0:
    plotExample(dbConnector)
elif n == 1:
    plotPQAEval(dbConnector)
