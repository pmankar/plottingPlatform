SELECT h.hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'OnChurnFilter_MStartupDelay'
		AND ms.time > 3600*1000000*1
		AND ms.value IS NULL
	GROUP BY h.hostid