SELECT (sl.sessionLength - stDelay.val)/((sl.sessionLength - stDelay.val) + (stNumber.val * stDuration.val)*(stNumber.val * stDuration.val)) as playbackSmoothness FROM
	(
	SELECT (ms.value)/(1000*1000) as sessionLength, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'OnChurnFilter_MSessionLength'
		AND ms.time > $mintime
		AND ms.value IS NOT NULL
	GROUP BY
		h.hostid) AS sl
	
JOIN (
	SELECT ms.value/(1000*1000) as val, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'OnChurnFilter_MStartupDelay'
		AND ms.time > $mintime
		AND ms.value IS NOT NULL
		AND h.hostid NOT IN ($excludeHosts)
	GROUP BY
		h.hostid) AS stDelay ON (stDelay.hostid = sl.hostid)
		
JOIN (
	SELECT ms.value/(1000*1000) as val, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'OnChurnFilter_MTotalDurationOfStalls'
		AND ms.time > $mintime
		AND ms.value IS NOT NULL
	GROUP BY
		h.hostid) AS stDuration ON (stDuration.hostid = sl.hostid)

JOIN (
	SELECT ms.value as val, h.hostid as hostid
	FROM
		measurements_single AS ms
		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
		JOIN metrics AS m ON(h.metricId = m.id)
		JOIN experiments AS e ON(m.experimentId = e.id)
	WHERE
		e.id = $eid
		AND m.name = 'OnChurnFilter_MNumberOfStalls'
		AND ms.time > $mintime
		AND ms.value IS NOT NULL
	GROUP BY
		h.hostid) AS stNumber ON (stNumber.hostid = sl.hostid)
