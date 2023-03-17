// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { DeviceService, getOptions } from './devices.class'
import { devicePath, deviceMethods } from './devices.shared'
import hooks from './devices.hooks'

export * from './devices.class'
export * from './devices.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const device = (app: Application) => {
  // Register our service on the Feathers application
  app.use(devicePath, new DeviceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(devicePath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [devicePath]: DeviceService
  }
}
