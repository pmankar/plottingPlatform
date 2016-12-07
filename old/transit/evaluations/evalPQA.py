from transit.transitClasses.Metric import Metric
from transit.transitClasses.ExperimentIDSelector import ExperimentIDSelector
from transit.transitClasses.Evaluation import Evaluation
from transit.transitClasses.Parameter import Parameter


def plotPQAEval(dbConnector):
    print("====== PQA Evaluation ======")
    # dbConnector.connectToDb("localhost", "root", "root", "scale_bp", 3306)
    dbConnector.connectToDb("192.168.100.166", "root", "anything92", "bp-small", 3306)
    minCountMultiMetrics = 1
    # timesRange = (60, 180)
    box = None
    metrics = [

        # Metric('Delta_MLayerSwitchCount', title='Layer Switch Count', minCount=minCountMultiMetrics, unit='',
        #        plotCDF=True, plotBox=box, plotBar=True),
        Metric('Delta_StallsDuration', title='Stall Duration', minCount=minCountMultiMetrics, unit='[s]',
               plotCDF=False, plotBox=box, plotBar=True, valueScale=1000000, valueRange=(0, 60)),
        # Metric('Delta_PlaybackPercentage', title='Playback Percentage', minCount=minCountMultiMetrics, unit='[%]',
        #        plotCDF=True, plotBox=box, plotBar=True, valueScale=0.01, valueRange=(0, 100)),
        # Metric('Delta_VideoQuality', title='Relative Received Video Quality', minCount=minCountMultiMetrics, unit='[%]',
        # plotCDF=True, plotBox=box, plotBar=True, valueScale=0.01
        # valueRange=(0,100)),
        # Metric('Delta_VideoQualityBR', title='Relative Received Video Quality', minCount=minCountMultiMetrics, unit='[%]',
        #        plotCDF=True, plotBox=box, plotBar=True, valueScale=0.01, valueRange=(0, 100)),
        # Metric('Delta_StallsCount', title='Stalls Count', minCount=minCountMultiMetrics, unit='',
        #        plotCDF=True, plotBox=box, plotBar=True)
    ]

    eSelector = ExperimentIDSelector()
    # eSelector.mask = "Transit WL:{WL} PQA_MODE:{PQA-MODE} PQA_INTERVAL:{PQA-INTERVAL} H_PLAYABLE:{H-PLAYABLE} S_PLAYABLE:{S-PLAYABLE} FA_INTERVAL:{FA-INTERVAL}"
    eSelector.mask = "Transit E1 WL:C1 CFG:Default PEERS:560/300/70"
    eSelector.overwriteDefault('FA-INTERVAL', '5')
    eSelector.overwriteDefault('PQA-INTERVAL', '10')

    print("====== PQA Mode Comparison ======")
    parameters = [
        Parameter('PQA-MODE', 'PQA Mode',
                  ['0'], '1', ['Disabled']),
    ]
    eSelector.overwriteDefault('WL', 'D1')
    eSelector.overwriteDefault('H-PLAYABLE', '4')
    eSelector.overwriteDefault('S-PLAYABLE', '3')
    evaluation = Evaluation('PQA-MODE Comparison', parameters, metrics, 'transit/sql', dbConnector)
    evaluation.runPlotting(eSelector, dbConnector)

    print("====== PQA Mode Comparison DONE! ===========")
