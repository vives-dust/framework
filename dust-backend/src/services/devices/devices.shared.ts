// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Devices, DevicesData, DevicesPatch, DevicesQuery, DevicesService } from './devices.class'

export type { Devices, DevicesData, DevicesPatch, DevicesQuery }

export type DevicesClientService = Pick<DevicesService<Params<DevicesQuery>>, (typeof devicesMethods)[number]>

export const devicesPath = 'devices'

export const devicesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const devicesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(devicesPath, connection.service(devicesPath), {
    methods: devicesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [devicesPath]: DevicesClientService
  }
}
