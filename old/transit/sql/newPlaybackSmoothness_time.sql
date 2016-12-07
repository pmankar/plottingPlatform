SELECT FLOOR(playDuration.time/($timescale)) as time, playDuration.play / (playDuration.play + stallDuration.stall) as smoothness FROM ( 
	SELECT ms.time as time, SUM(ms.value/($scale)) as stall
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
	GROUP BY ms.time
	) AS stallDuration
JOIN (
	SELECT ms.time as time, SUM(ms.value/(1)) as play
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
	GROUP BY ms.time
	) AS playDuration ON (playDuration.time = stallDuration.time)
-- 
-- SELECT FLOOR(playDuration.time/($timescale)) as time, AVG(playDuration.play / (playDuration.play + stallDuration.stall)) as smoothness FROM ( 
-- 	SELECT ms.time as time, ms.value/($scale) as stall, h.hostid as hostid
-- 	FROM
-- 		measurements_single AS ms
-- 		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
-- 		JOIN metrics AS m ON(h.metricId = m.id)
-- 		JOIN experiments AS e ON(m.experimentId = e.id)
-- 	WHERE
-- 		e.id = $eid
-- 		AND m.name = 'Delta_StallsDuration'
-- 		AND ms.time > $mintime
-- 		AND h.hostid NOT IN ($excludeHosts)
-- 		AND ms.value IS NOT NULL
-- 	) AS stallDuration
-- JOIN (
-- 	SELECT ms.time as time, ms.value/($scale) as play, h.hostid as hostid
-- 	FROM
-- 		measurements_single AS ms
-- 		JOIN hostmetrics AS h ON(ms.hostMetricId = h.id)
-- 		JOIN metrics AS m ON(h.metricId = m.id)
-- 		JOIN experiments AS e ON(m.experimentId = e.id)
-- 	WHERE
-- 		e.id = $eid
-- 		AND m.name = 'Delta_PlaybackDuration'
-- 		AND ms.time > $mintime
-- 		AND h.hostid NOT IN ($excludeHosts)
-- 		AND ms.value IS NOT NULL
-- 	) AS playDuration ON (playDuration.time = stallDuration.time AND playDuration.hostid = stallDuration.hostid)
-- WHERE NOT (playDuration.play = 0 AND stallDuration.stall = 0)
-- GROUP BY playDuration.time