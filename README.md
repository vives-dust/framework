# DUST Framework

## Services

* [Backend API (FeathersJS)](https://dust.devbitapp.be/api)
* [Grafana](https://dust.devbitapp.be/grafana)
* [API Docs](https://dust.devbitapp.be/docs/api)
* [FrontEnd](https://dust.devbitapp.be)

![Services](img/framework-services.drawio.png)

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

### Services

* [InfluxDB](http://localhost:8086/)
* [MongoExpress](http://localhost:8081/)
* [FeathersJS](http://localhost:3030/)
* [Grafana](http://localhost:3000/)
* [API Docs](http://localhost/)

## Info Resources

### Flux Overview

[https://www.sqlpac.com/en/documents/influxdb-moving-from-influxql-language-to-flux-language.html](https://www.sqlpac.com/en/documents/influxdb-moving-from-influxql-language-to-flux-language.html).
