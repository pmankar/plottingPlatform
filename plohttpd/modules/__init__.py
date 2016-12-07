#!/usr/bin/env python

from plohttpd.httpd import ApplicationException
import multiprocessing


def process_in_background(serveHandler):
    processes = {}

    def handleProcess(data, statusQueue):
        def updateStatus(**statusUpdate):
            statusQueue.put(statusUpdate)

        try:
            response = serveHandler(data, updateStatus)
            updateStatus(response=response)
        except ApplicationException as e:
            updateStatus(exception=e)

    def process_statusqueue(process):
        while not process["statusQueue"].empty():
            statusUpdate = process["statusQueue"].get()

            if "message" in statusUpdate:
                if "messages" not in process["status"]:
                    process["status"]["messages"] = []
                process["status"]["messages"].append(statusUpdate["message"])

            if "progress" in statusUpdate:
                process["status"]["progress"] = statusUpdate["progress"]

            if "response" in statusUpdate:
                process["response"] = statusUpdate["response"]

            if "exception" in statusUpdate:
                process["exception"] = statusUpdate["exception"]

    def wrap(data):
        if "_processid" in data:
            try:
                pid = data["_processid"]
                process = processes[pid]
            except KeyError:
                raise ApplicationException(message="Unknown Process")

            process_statusqueue(process)

            if "response" in process:
                return process["response"]
            elif "exception" in process:
                raise process["exception"]
        else:
            statusQueue = multiprocessing.Queue()
            process = multiprocessing.Process(target=handleProcess, args=(data, statusQueue))
            process.start()
            pid = process.pid
            process = {"statusQueue": statusQueue, "status": {}}
            processes[pid] = process

        return {"result": "running", "_processid": pid, "status": process["status"]}

    return wrap
