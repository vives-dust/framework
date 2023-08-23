// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { SensorType, SensorTypeData, SensorTypePatch, SensorTypeQuery } from './sensortypes.schema'

export type { SensorType, SensorTypeData, SensorTypePatch, SensorTypeQuery }

export interface SensorTypeParams extends MongoDBAdapterParams<SensorTypeQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class SensorTypeService<ServiceParams extends Params = SensorTypeParams> extends MongoDBService<
  SensorType,
  SensorTypeData,
  SensorTypeParams,
  SensorTypePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app
    .get('mongodbClient')
    .then((db) => db.collection('sensortypes'))
    // Index types and make unique
    .then((collection) => {
      collection.createIndex({ type: 1 }, { unique: true })
      return collection
    })
  }
}
