// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Sensor, SensorData, SensorPatch, SensorQuery } from './sensors.schema'

export type { Sensor, SensorData, SensorPatch, SensorQuery }

export interface SensorParams extends MongoDBAdapterParams<SensorQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class SensorService<ServiceParams extends Params = SensorParams> extends MongoDBService<
  Sensor,
  SensorData,
  SensorParams,
  SensorPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('sensors'))
  }
}
