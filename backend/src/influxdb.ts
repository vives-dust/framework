import { InfluxDB } from '@influxdata/influxdb-client';
import { Application } from './declarations';

export default function (app: Application): void {
  const connectionParams = app.get('influxdb');

  const url = `http://${connectionParams.host}:${connectionParams.port}`;
  const queryApi = new InfluxDB( { url, token: connectionParams.token }).getQueryApi(connectionParams.org);

  app.set('influxQueryAPI', queryApi);
}
