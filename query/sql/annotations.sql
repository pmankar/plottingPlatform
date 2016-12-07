SELECT
	DISTINCT `msa`.`annotation`
FROM
	`measurement_single_annotations` `msa`
LEFT JOIN
	`measurements_single` `ms` ON (`ms`.`id` = `msa`.`measurementSingleId`)
LEFT JOIN
	`hostmetrics` `hm` ON (`hm`.`id` = `ms`.`hostMetricId`)
LEFT JOIN
	`metrics` `m` ON (`m`.`id` = `hm`.`metricId`)
WHERE
	`m`.`experimentId` IN ($eids)
