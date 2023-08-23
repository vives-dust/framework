// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DeviceType,
  DeviceTypeData,
  DeviceTypePatch,
  DeviceTypeQuery,
  DeviceTypeService
} from './devicetypes.class'

export type { DeviceType, DeviceTypeData, DeviceTypePatch, DeviceTypeQuery }

export type DeviceTypeClientService = Pick<
  DeviceTypeService<Params<DeviceTypeQuery>>,
  (typeof deviceTypeMethods)[number]
>

export const deviceTypePath = 'devicetypes'

export const deviceTypeMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const deviceTypeClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(deviceTypePath, connection.service(deviceTypePath), {
    methods: deviceTypeMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [deviceTypePath]: DeviceTypeClientService
  }
}
