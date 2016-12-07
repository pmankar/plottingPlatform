from transit.transitClasses.Metric import Metric
from transit.transitClasses.ExperimentIDSelector import ExperimentIDSelector
from transit.transitClasses.Evaluation import Evaluation
from transit.transitClasses.Parameter import Parameter


def plotExample(dbConnector):

    print("====== Example Evaluation ======")
    dbConnector.connectToDb("localhost", "root", "root", "scale_bp", 3369)
    timesRange = (0, 5)
    box = None
    metrics = [
        Metric('Dao_PeersPresent', title='#Peers', query='single', valueScale=60, unit='',
               plotTime={'marker': True, 'plotScenario': True,
                         'args': {'legendPos': 'best', 'xrange': timesRange}},
               plotCDF=True,
               plotBox=box),
    ]
    parameters = [
        Parameter("Host", 'Amount of hosts online', ['1'], '1', labels=['A1']),
    ]

    eSelector = ExperimentIDSelector()
    eSelector.overwriteDefault('E', 'E1')
    eSelector.overwriteDefault('WL', 'A1')
    eSelector.overwriteDefault('CFG', 'Default')
    eSelector.overwriteDefault('PEERS', '1400/750/350')

    evaluation = Evaluation(
        'ExampleFolder', parameters, metrics, 'transit/sql', dbConnector)
    evaluation.runPlotting(eSelector, dbConnector)
    print("====== Example Evaluation DONE! ===========")
