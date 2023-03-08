// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  SensorTypes,
  SensorTypesData,
  SensorTypesPatch,
  SensorTypesQuery,
  SensorTypesService
} from './sensortypes.class'

export type { SensorTypes, SensorTypesData, SensorTypesPatch, SensorTypesQuery }

export type SensorTypesClientService = Pick<
  SensorTypesService<Params<SensorTypesQuery>>,
  (typeof sensorTypesMethods)[number]
>

export const sensorTypesPath = 'sensortypes'

export const sensorTypesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const sensorTypesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(sensorTypesPath, connection.service(sensorTypesPath), {
    methods: sensorTypesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [sensorTypesPath]: SensorTypesClientService
  }
}
