import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import {
  FluxTableMetaData,
  ParameterizedQuery,
} from '@influxdata/influxdb-client';
import { MethodNotAllowed } from '@feathersjs/errors';
import { QueryBuilder, Period } from '../../influxdb/query_builder';

export interface Measurement {}

interface ServiceOptions {}

export class Measurements implements ServiceMethods<Measurement> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // Idea is to make very generic find that we can basically use
  // to fetch any influxdb measurement

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Measurement[]> {
    const queryApi = this.app.get('influxQueryAPI');

    let influxQueryParams = {
      bucket: this.app.get('influxdb').bucket,
      measurement: params?.query?.measurement || 'dust-sensor',
      tags: { devId: params?.query?.deviceId },    // devId = InfluxDB2 tag that is knows as hardwareId in MongoDB
      fields: params?.query?.fields,
      drop: params?.query?.drop,
      period: (params?.query?.period ? <any>Period[params?.query?.period as any] : undefined),
      start: params?.query?.start,
      stop: params?.query?.stop,
      every: params?.query?.every,
      aliases: (params?.query?.aliases ? Object.fromEntries(params?.query?.aliases) : undefined),
      pruneTags: params?.query?.pruneTags,
    }

    let fluxQuery: ParameterizedQuery = QueryBuilder.build_query(influxQueryParams);
    // console.log(fluxQuery);

    return new Promise((resolve) => {
      let results : Measurement[] = [];
      queryApi.queryRows(fluxQuery, {
        next(row: string[], tableMeta: FluxTableMetaData) {
          let influxObject = tableMeta.toObject(row);

          // Delete some influxdb specific meta data
          delete influxObject.table;
          delete influxObject.result;

          results.push(influxObject);
        },
        error(error: Error) {
          console.log("Error")
          console.error(error);
        },
        complete() {
          resolve(results);
        },
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Measurement> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: Measurement, params?: Params): Promise<Measurement> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Measurement, params?: Params): Promise<Measurement> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Measurement, params?: Params): Promise<Measurement> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Measurement> {
    throw new MethodNotAllowed();
  }
}
