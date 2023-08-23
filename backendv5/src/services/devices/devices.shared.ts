// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Device, DeviceData, DevicePatch, DeviceQuery, DeviceService } from './devices.class'

export type { Device, DeviceData, DevicePatch, DeviceQuery }

export type DeviceClientService = Pick<DeviceService<Params<DeviceQuery>>, (typeof deviceMethods)[number]>

export const devicePath = 'devices'

export const deviceMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const deviceClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(devicePath, connection.service(devicePath), {
    methods: deviceMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [devicePath]: DeviceClientService
  }
}
