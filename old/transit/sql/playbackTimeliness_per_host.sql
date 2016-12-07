SELECT MAX(value)/(1000*1000) as val
FROM
	measurements_single AS ms
	JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
	JOIN metrics AS m ON(h.metricId = m.id)
	JOIN experiments AS e ON(m.experimentId = e.id)
WHERE
	e.id = $eid
	AND m.name = 'Dao_MPlaybackTimeliness'
	AND ms.time > $mintime AND ms.time < $maxtime
	AND h.hostid NOT IN ($excludeHosts)
	AND ms.value IS NOT NULL
GROUP BY
	h.hostid