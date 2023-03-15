// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DeviceTypes,
  DeviceTypesData,
  DeviceTypesPatch,
  DeviceTypesQuery,
  DeviceTypesService
} from './devicetypes.class'

export type { DeviceTypes, DeviceTypesData, DeviceTypesPatch, DeviceTypesQuery }

export type DeviceTypesClientService = Pick<
  DeviceTypesService<Params<DeviceTypesQuery>>,
  (typeof deviceTypesMethods)[number]
>

export const deviceTypesPath = 'devicetypes'

export const deviceTypesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const deviceTypesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(deviceTypesPath, connection.service(deviceTypesPath), {
    methods: deviceTypesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [deviceTypesPath]: DeviceTypesClientService
  }
}
