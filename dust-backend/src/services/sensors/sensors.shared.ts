// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Sensors, SensorsData, SensorsPatch, SensorsQuery, SensorsService } from './sensors.class'

export type { Sensors, SensorsData, SensorsPatch, SensorsQuery }

export type SensorsClientService = Pick<SensorsService<Params<SensorsQuery>>, (typeof sensorsMethods)[number]>

export const sensorsPath = 'sensors'

export const sensorsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const sensorsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(sensorsPath, connection.service(sensorsPath), {
    methods: sensorsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [sensorsPath]: SensorsClientService
  }
}
