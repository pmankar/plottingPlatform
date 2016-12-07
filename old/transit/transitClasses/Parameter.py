'''
Created on 05.10.2012

@author: Bjoern
'''


class Parameter:
    name = ''
    title = ''
    variations = list()
    fixed = ''
    labels = None

    def __init__(self, name, title, variations, fixed, labels=None):
        self.name = name
        self.title = title
        self.variations = variations
        self.fixed = fixed
        if (labels is None):
            self.labels = variations
        else:
            self.labels = labels
