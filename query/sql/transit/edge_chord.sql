SELECT hostgroupa, hostgroupb, SUM(value)/($scale) FROM
(SELECT hia.hostgroup AS hostgroupa, hib.hostgroup AS hostgroupb, MAX(mse.value) AS value
FROM	measurements_single_edge AS mse
	JOIN measurements_single AS msa ON (mse.measurementSingleId = msa.id)
	JOIN hostmetrics AS hma ON (msa.hostMetricId = hma.id)
	JOIN metrics AS ma ON (hma.metricId = ma.id)
	JOIN host_info AS hia ON (hia.id = hma.hostId)
	JOIN host_info AS hib ON (hib.id = mse.measurementHostId)
WHERE
	hia.experimentId = $eid
	AND ma.name = '$metric'
	AND msa.time > $mintime
	AND hia.id NOT IN ($excludeHosts)
	AND hib.id NOT IN ($excludeHosts)
GROUP BY
	hia.id, hib.id) AS result
GROUP BY hostgroupa, hostgroupb
