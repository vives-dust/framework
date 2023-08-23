// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  SensorType,
  SensorTypeData,
  SensorTypePatch,
  SensorTypeQuery,
  SensorTypeService
} from './sensortypes.class'

export type { SensorType, SensorTypeData, SensorTypePatch, SensorTypeQuery }

export type SensorTypeClientService = Pick<
  SensorTypeService<Params<SensorTypeQuery>>,
  (typeof sensorTypeMethods)[number]
>

export const sensorTypePath = 'sensortypes'

export const sensorTypeMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const sensorTypeClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(sensorTypePath, connection.service(sensorTypePath), {
    methods: sensorTypeMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [sensorTypePath]: SensorTypeClientService
  }
}
