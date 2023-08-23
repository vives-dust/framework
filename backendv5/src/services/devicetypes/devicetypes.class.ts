// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { DeviceType, DeviceTypeData, DeviceTypePatch, DeviceTypeQuery } from './devicetypes.schema'

export type { DeviceType, DeviceTypeData, DeviceTypePatch, DeviceTypeQuery }

export interface DeviceTypeParams extends MongoDBAdapterParams<DeviceTypeQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class DeviceTypeService<ServiceParams extends Params = DeviceTypeParams> extends MongoDBService<
  DeviceType,
  DeviceTypeData,
  DeviceTypeParams,
  DeviceTypePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app
    .get('mongodbClient')
    .then((db) => db.collection('devicetypes'))
    // Index types and make unique
    .then((collection) => {
      collection.createIndex({ type: 1 }, { unique: true })
      return collection
    })
  }
}
