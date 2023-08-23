// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Sensor, SensorData, SensorPatch, SensorQuery, SensorService } from './sensors.class'

export type { Sensor, SensorData, SensorPatch, SensorQuery }

export type SensorClientService = Pick<SensorService<Params<SensorQuery>>, (typeof sensorMethods)[number]>

export const sensorPath = 'sensors'

export const sensorMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const sensorClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(sensorPath, connection.service(sensorPath), {
    methods: sensorMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [sensorPath]: SensorClientService
  }
}
