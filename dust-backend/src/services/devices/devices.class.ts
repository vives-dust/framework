// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Devices, DevicesData, DevicesPatch, DevicesQuery } from './devices.schema'

export type { Devices, DevicesData, DevicesPatch, DevicesQuery }

export interface DevicesParams extends MongoDBAdapterParams<DevicesQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class DevicesService<ServiceParams extends Params = DevicesParams> extends MongoDBService<
  Devices,
  DevicesData,
  DevicesParams,
  DevicesPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('devices'))
  }
}
