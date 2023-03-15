// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { DevicesService, getOptions } from './devices.class'
import { devicesPath, devicesMethods } from './devices.shared'
import hooks from './devices.hooks'

export * from './devices.class'
export * from './devices.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const devices = (app: Application) => {
  // Register our service on the Feathers application
  app.use(devicesPath, new DevicesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: devicesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(devicesPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [devicesPath]: DevicesService
  }
}
