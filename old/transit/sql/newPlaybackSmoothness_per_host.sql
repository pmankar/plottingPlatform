SELECT aggregated.smoothness FROM (
SELECT AVG(playDuration.play / (playDuration.play + stallDuration.stall)) as smoothness FROM ( 
	SELECT SUM(ms.value/($scale)) as stall, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'Delta_StallsDuration'
		AND ms.time > $mintime
		AND h.hostid NOT IN ($excludeHosts)
		AND ms.value IS NOT NULL
	GROUP BY h.hostid
	) AS stallDuration
JOIN (
	SELECT SUM(ms.value/($scale)) as play, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'Delta_PlaybackDuration'
		AND ms.time > $mintime
		AND h.hostid NOT IN ($excludeHosts)
		AND ms.value IS NOT NULL
	GROUP BY h.hostid
	) AS playDuration ON playDuration.hostid = stallDuration.hostid
WHERE NOT (playDuration.play = 0 AND stallDuration.stall = 0)
GROUP BY playDuration.hostid) AS aggregated