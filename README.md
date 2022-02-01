# DUST Framework

## Development

1. Setup the env files
2. Fire up the containers

```bash
docker-compose -f docker-compose.dev.yml up --build
```

3. Create influxdb database

For v1.x

```bash
docker-compose exec influxdb influx
create database "dust-staging"
```
