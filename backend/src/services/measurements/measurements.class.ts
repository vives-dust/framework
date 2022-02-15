import { MethodNotAllowed } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import {
  FluxTableMetaData,
  ParameterizedQuery,
} from '@influxdata/influxdb-client';
import { QueryBuilder, Period } from '../../influxdb/query_builder';

export interface Measurement {
  field: string;
  value: number;
  time: string;
}

interface ServiceOptions {}

export class Measurements implements ServiceMethods<Array<Measurement>> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Array<Measurement> | Paginated<Array<Measurement>>> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Array<Measurement>> {
    // id = deviceId here, which is the hardwareId

    const queryPeriod = params?.query?.period as string || 'last';
    const fields = params?.query?.fields as Array<string> || ['counter'];

    const bucket = this.app.get('influxdb').bucket;
    const queryApi = this.app.get('influxQueryAPI');
    const measurement = 'dust-sensor';

    let fluxQuery: ParameterizedQuery;
    if (queryPeriod === 'last') {
      // Only last value query
      fluxQuery = QueryBuilder.last_measurement(bucket, measurement, `${id}`, fields);
    } else {
      const period = <any>Period[queryPeriod as any];
      fluxQuery = QueryBuilder.measurements_aggregate_window(bucket, measurement, `${id}`, period, fields);
    }

    console.log(fluxQuery);

    return new Promise((resolve, reject) => {
      const result: Array<Measurement> = [];
      queryApi.queryRows(fluxQuery, {
        next(row: string[], tableMeta: FluxTableMetaData) {
          const influxObject = tableMeta.toObject(row);
          console.log(influxObject);

          fields.forEach(f => {
            result.push({
              field: f,
              value: influxObject[f],
              time: influxObject._time
            });
          });
        },
        error(error: Error) {
          console.error(error);
          reject(error);
        },
        complete() {
          resolve(result);
        },
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: Array<Measurement>, params?: Params): Promise<Array<Measurement>> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Array<Measurement>, params?: Params): Promise<Array<Measurement>> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Array<Measurement>, params?: Params): Promise<Array<Measurement>> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Array<Measurement>> {
    throw new MethodNotAllowed();
  }
}
