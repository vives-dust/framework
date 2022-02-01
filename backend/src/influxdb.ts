import { InfluxDB } from 'influx';
import { Application } from './declarations';

export default function (app: Application): void {
  const connectionParams = app.get('influxdb');
  const influxClient = new InfluxDB({
    host: connectionParams.host,
    port: connectionParams.port,
    database: connectionParams.database,
  });

  app.set('influxClient', influxClient);
}
