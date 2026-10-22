# Grafana 12.4 upgrade

The deployment pins Grafana to `grafana/grafana:12.4.13` and persists its database and plugins in the `grafana-data` named volume. Anonymous access remains Viewer.

## Existing deployments: migrate before recreating

Older Compose configurations persisted provisioned dashboard JSON files but did not persist `/var/lib/grafana`, which contains the SQLite database, users, UI-created dashboards and plugins. Adding an empty volume does not preserve that state automatically.

Before applying this configuration to an existing installation:

1. Record the previous image ID and preserve the current Compose and provisioning files.
2. Pull the pinned target image before the maintenance window.
3. Stop only Grafana to take a consistent backup of `/var/lib/grafana`, including its SQLite database. Keep backups private and outside Git: they contain sensitive state.
4. Restore that backup into the Compose project's `grafana-data` volume, preserving ownership (the official image uses UID 472). Verify the copied database checksum and integrity before recreating the service. Never overwrite an existing populated volume without inspecting and backing it up first.
5. Apply the v1 dashboard provisioning configuration and recreate only Grafana with `docker compose up -d --no-deps grafana`.
6. Check `/api/health`, public dashboards and a real data-source query. Check that anonymous users have Viewer access and cannot access `/api/org/users`.

Rollback requires the saved image, configuration and pre-upgrade database backup; do not assume that reverting the image alone reverses database migrations. Stop Grafana before restoring data, and preserve the failed state for diagnosis.

## Provisioning compatibility

The old dashboard provider file used a legacy bare list with `org_id` and `options.folder`. The updated file uses `apiVersion: 1`, `providers`, `orgId` and `options.path`.

With the old file, 12.4.13 crashed during startup in `dashboards.(*configReader).parseConfigs`, while attempting to log the deprecated format using an uninitialized logger. A separate, network-isolated 12.4.13 container started successfully with the copied pre-upgrade database and the v1 provider file before production was retried.

## Production verification (2026-10-22)

- Grafana health: version 12.4.13, database OK.
- All nine dashboard definitions accessible anonymously.
- Anonymous role Viewer; organization user list returns HTTP 403.
- InfluxDB query returned recent data (measurement values not recorded).
- `/var/lib/grafana` is mounted from `dust_grafana-data`; observed restart count zero.
- Original backup stored privately on the deployment host under `~/dust-backups/grafana-20261022-170225/`.
- Known pre-existing limitation: a Redis data source is provisioned, but the `redis-datasource` plugin was not installed in the original container and remains absent. `PLUGINS=redis-datasource` is not the documented Grafana plugin preinstallation setting. Redis dashboard functionality was not certified by this upgrade.

## Sources

- [Grafana Docker storage and plugin configuration](https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/)
- [Grafana 12.4 upgrade guide](https://grafana.com/docs/grafana/latest/upgrade-guide/upgrade-v12.4/)
- [Grafana 12.4.13 dashboard configuration reader](https://github.com/grafana/grafana/blob/v12.4.13/pkg/services/provisioning/dashboards/config_reader.go)
- [Grafana support policy](https://grafana.com/docs/grafana/latest/upgrade-guide/when-to-upgrade/): 12.4.x patch support ends May 24, 2027.
