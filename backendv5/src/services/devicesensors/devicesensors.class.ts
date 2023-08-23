// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  DeviceSensor,
  DeviceSensorData,
  DeviceSensorPatch,
  DeviceSensorQuery
} from './devicesensors.schema'

export type { DeviceSensor, DeviceSensorData, DeviceSensorPatch, DeviceSensorQuery }

export interface DeviceSensorParams extends MongoDBAdapterParams<DeviceSensorQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class DeviceSensorService<ServiceParams extends Params = DeviceSensorParams> extends MongoDBService<
  DeviceSensor,
  DeviceSensorData,
  DeviceSensorParams,
  DeviceSensorPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('devicesensors'))
  }
}
