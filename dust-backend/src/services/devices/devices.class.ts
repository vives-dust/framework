// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Device, DeviceData, DevicePatch, DeviceQuery } from './devices.schema'

export type { Device, DeviceData, DevicePatch, DeviceQuery }

export interface DeviceParams extends MongoDBAdapterParams<DeviceQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class DeviceService<ServiceParams extends Params = DeviceParams> extends MongoDBService<
  Device,
  DeviceData,
  DeviceParams,
  DevicePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('devices'))
  }
}
