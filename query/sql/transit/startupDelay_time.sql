SELECT FLOOR((sessionlength.sessionend - sessionlength.sessionlength)/($timescale)) as time, startup.startup/($scale) as startup FROM (
	SELECT ms.value as startup, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = '$metric'
		AND ms.time > $mintime
		AND h.hostid NOT IN ($excludeHosts)
		AND ms.value IS NOT NULL
) AS startup
JOIN (
	SELECT ms.time as sessionend, ms.value as sessionlength, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'OnChurnFilter_MSessionlength'
		AND ms.time > $mintime
		AND h.hostid NOT IN ($excludeHosts)
		AND ms.value IS NOT NULL
) AS sessionlength ON (startup.hostid = sessionlength.hostid)
