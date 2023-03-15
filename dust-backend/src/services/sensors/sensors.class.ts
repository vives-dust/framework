// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Sensors, SensorsData, SensorsPatch, SensorsQuery } from './sensors.schema'

export type { Sensors, SensorsData, SensorsPatch, SensorsQuery }

export interface SensorsParams extends MongoDBAdapterParams<SensorsQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class SensorsService<ServiceParams extends Params = SensorsParams> extends MongoDBService<
  Sensors,
  SensorsData,
  SensorsParams,
  SensorsPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('sensors'))
  }
}
