// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DeviceSensor,
  DeviceSensorData,
  DeviceSensorPatch,
  DeviceSensorQuery,
  DeviceSensorService
} from './devicesensors.class'

export type { DeviceSensor, DeviceSensorData, DeviceSensorPatch, DeviceSensorQuery }

export type DeviceSensorClientService = Pick<
  DeviceSensorService<Params<DeviceSensorQuery>>,
  (typeof deviceSensorMethods)[number]
>

export const deviceSensorPath = 'devicesensors'

export const deviceSensorMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const deviceSensorClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(deviceSensorPath, connection.service(deviceSensorPath), {
    methods: deviceSensorMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [deviceSensorPath]: DeviceSensorClientService
  }
}
