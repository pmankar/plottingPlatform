'''
Created on 05.10.2012

@author: Bjoern
'''


class ExperimentIDSelector:

    mask = ''
    defaults = None
    minID = 0
    maxID = 999999

    def __init__(self, defaults=None, mask=None, minID=0, maxID=999999):
        if (defaults is None):
            self.defaults = {'E': 'E3', 'WL': 'A1', 'PEERS': '1400/750/350', 'CFG': 'MeshOnly2', 'NEI': '60s', 'CMI': '32', 'CMO': '32', 'CMII': '4',
                             'RBUS': '15', 'BEI': '2s', 'CIT': '15s', 'CIKP': '0', 'CMINI': '12', 'FR': '0', 'NSI': '10s', 'SWS': '20s', 'UWS': '60s', 'SCHED': '1'}
        if (mask is None):
            self.mask = "Transit {E} WL:{WL} CFG:{CFG} PEERS:{PEERS} NEI:{NEI} CMI:{CMI} CMO:{CMO} CMII:{CMII} RBUS:{RBUS} BEI:{BEI} CIT:{CIT} CIKP:{CIKP} CMINI:{CMINI} NSI:{NSI} SWS:{SWS} UWS:{UWS} SCHED:{SCHED}"

        self.minID = minID
        self.maxID = maxID

    def overwriteDefault(self, key, value):
        self.defaults[key] = value

    # Returns all IDs for the given parameter (grouped by parameter setting)
    def getIdsForParameter(self, parameter, dbConnector):
        experiments = dbConnector.queryMultiCol("SELECT id, name, seed FROM experiments WHERE endDate IS NOT NULL AND id >= " + str(
            self.minID) + " AND id <= " + str(self.maxID), ignoreCache=True)
        variations = parameter.variations
        name = parameter.name
        exps = list()
        for v in variations:
            replacements = self.defaults.copy()
            replacements[name] = v
            experimentmask = self.mask.format(**replacements)
            # all IDs for this variation
            index = 0
            ids = list()
            for eName in experiments.getListForIndex(1):
                if (eName == experimentmask):
                    ids.append(experiments.getListForIndex(0)[index])
                index = index + 1
            exps.append(ids)
            if (len(ids) == 0):
                print('No Experiments found for ' + str(experimentmask) +
                      ' based on replacements ' + str(replacements))
        print(exps)
        return exps
