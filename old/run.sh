#!/bin/sh

cd $(dirname $0)
PYTHONPATH="." python2 ./transit/plotEvaluations.py
