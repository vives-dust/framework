import { MethodNotAllowed } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import {
  FluxTableMetaData,
  ParameterizedQuery,
} from '@influxdata/influxdb-client';
import { QueryBuilder, Period } from '../../influxdb/query_builder';

export interface MeasurementData {
  temperature?: number;
  level_1?: number;
  level_2?: number;
  level_3?: number;
  level_4?: number;
  time: string;
}

export interface MeasurementDataArray extends Array<MeasurementData>{}

interface ServiceOptions {}

export class Measurements implements ServiceMethods<MeasurementDataArray> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<MeasurementDataArray[] | Paginated<MeasurementDataArray>> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<MeasurementDataArray> {
    // id = deviceId here

    const queryPeriod = params?.query?.period as string || 'last';

    const bucket = this.app.get('influxdb').bucket;
    const queryApi = this.app.get('influxQueryAPI');

    const measurement = 'dust-sensor';
    const fields = [
      { field: 'internalTemperature', alias: 'temperature' },
      { field: 'moistureLevel_1', alias: 'level_1' },
      { field: 'moistureLevel_2', alias: 'level_2' },
      { field: 'moistureLevel_3', alias: 'level_3' },
      { field: 'moistureLevel_4', alias: 'level_4' },
    ];

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
      const result: MeasurementDataArray = [];
      queryApi.queryRows(fluxQuery, {
        next(row: string[], tableMeta: FluxTableMetaData) {
          const influxObject = tableMeta.toObject(row);
          result.push({
            temperature: influxObject.temperature,
            level_1: influxObject.level_1,
            level_2: influxObject.level_2,
            level_3: influxObject.level_3,
            level_4: influxObject.level_4,
            time: influxObject._time
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
  async create (data: MeasurementDataArray, params?: Params): Promise<MeasurementDataArray> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: MeasurementDataArray, params?: Params): Promise<MeasurementDataArray> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: MeasurementDataArray, params?: Params): Promise<MeasurementDataArray> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<MeasurementDataArray> {
    throw new MethodNotAllowed();
  }
}
