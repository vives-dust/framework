// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { SensorTypes, SensorTypesData, SensorTypesPatch, SensorTypesQuery } from './sensortypes.schema'

export type { SensorTypes, SensorTypesData, SensorTypesPatch, SensorTypesQuery }

export interface SensorTypesParams extends MongoDBAdapterParams<SensorTypesQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class SensorTypesService<ServiceParams extends Params = SensorTypesParams> extends MongoDBService<
  SensorTypes,
  SensorTypesData,
  SensorTypesParams,
  SensorTypesPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('sensortypes'))
  }
}
