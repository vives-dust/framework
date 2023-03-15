// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DeviceSensors,
  DeviceSensorsData,
  DeviceSensorsPatch,
  DeviceSensorsQuery,
  DeviceSensorsService
} from './devicesensors.class'

export type { DeviceSensors, DeviceSensorsData, DeviceSensorsPatch, DeviceSensorsQuery }

export type DeviceSensorsClientService = Pick<
  DeviceSensorsService<Params<DeviceSensorsQuery>>,
  (typeof deviceSensorsMethods)[number]
>

export const deviceSensorsPath = 'devicesensors'

export const deviceSensorsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const deviceSensorsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(deviceSensorsPath, connection.service(deviceSensorsPath), {
    methods: deviceSensorsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [deviceSensorsPath]: DeviceSensorsClientService
  }
}
