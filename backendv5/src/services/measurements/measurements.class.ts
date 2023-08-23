// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Measurement, MeasurementQuery } from './measurements.schema'
import { InfluxDBQueryParams, Period, QueryBuilder } from '../../influxdb/query_builder'
import { FluxTableMetaData, ParameterizedQuery } from '@influxdata/influxdb-client'

export type { Measurement, MeasurementQuery }

export interface MeasurementServiceOptions {
  app: Application
}

export interface MeasurementParams extends Params<MeasurementQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class MeasurementService<ServiceParams extends MeasurementParams = MeasurementParams>
  implements ServiceInterface<Measurement, undefined, ServiceParams, undefined>
{
  constructor(public options: MeasurementServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Measurement[]> {
    const queryApi = this.options.app.get('influxQueryAPI');

    let influxQueryParams = {
      bucket: _params?.query?.bucket || this.options.app.get('influxdb').bucket,
      measurement: _params?.query?.measurement || 'dust-sensor',
      tags: (_params?.query?.tags || undefined),
      fields: _params?.query?.fields,
      drop: _params?.query?.drop,
      period: (_params?.query?.period ? <any>Period[_params?.query?.period as any] : undefined),
      start: _params?.query?.start,
      stop: _params?.query?.stop,
      every: _params?.query?.every,
      aliases: (_params?.query?.aliases || undefined),
      pruneTags: _params?.query?.pruneTags,
    } as InfluxDBQueryParams;

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

          results.push(influxObject as Measurement);
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

}

export const getOptions = (app: Application) => {
  return { app }
}
