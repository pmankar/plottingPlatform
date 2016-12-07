SELECT perHost.overhead/($scale) FROM
(
SELECT 1 - avg(value) as overhead, count(value) as ct
FROM
	measurements_single AS ms
	JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
	JOIN metrics AS m ON(h.metricId = m.id)
	JOIN experiments AS e ON(m.experimentId = e.id)
WHERE
	e.id = $eid
	AND m.name = '$metric'
	AND ms.time > $mintime
	AND ms.value IS NOT NULL AND ms.value > 0
	AND h.hostid NOT IN ($excludeHosts)
GROUP BY
	h.hostid
) as perHost
WHERE perHost.ct >= $mincount