SELECT FLOOR((sessionlength.sessionend - sessionlength.sessionlength)/($timescale)) as time, (playDuration.play / (playDuration.play + stallDuration.stall + startup.startup)) as smoothness FROM ( 
	SELECT SUM(ms.value) as stall, h.hostid as hostid
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
	SELECT SUM(ms.value) as play, h.hostid as hostid
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
JOIN (
	SELECT ms.value as startup, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'OnChurnFilter_MStartupDelay'
		AND ms.time > $mintime
		AND h.hostid NOT IN ($excludeHosts)
		AND ms.value IS NOT NULL
	GROUP BY h.hostid
	) AS startup ON startup.hostid = stallDuration.hostid
JOIN (
	SELECT ms.time as sessionend, ms.value as sessionlength, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'OnChurnFilter_MSessionLength'
		AND ms.time > $mintime
		AND h.hostid NOT IN ($excludeHosts)
		AND ms.value IS NOT NULL
) AS sessionlength ON (sessionlength.hostid = stallDuration.hostid)
WHERE NOT (playDuration.play = 0 AND stallDuration.stall = 0)
GROUP BY playDuration.hostid