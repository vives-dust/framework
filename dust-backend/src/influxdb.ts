// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { InfluxDB, QueryApi } from '@influxdata/influxdb-client';
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    influxQueryAPI: QueryApi
  }
}

export const mongodb = (app: Application) => {
  const connectionParams = app.get('influxdb');

  const url = `http://${connectionParams.host}:${connectionParams.port}`;
  const queryApi = new InfluxDB( { url, token: connectionParams.token }).getQueryApi(connectionParams.org);

  app.set('influxQueryAPI', queryApi);
}
