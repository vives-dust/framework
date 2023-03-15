// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { DeviceTypesService, getOptions } from './devicetypes.class'
import { deviceTypesPath, deviceTypesMethods } from './devicetypes.shared'
import hooks from './devicetypes.hooks'

export * from './devicetypes.class'
export * from './devicetypes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const deviceTypes = (app: Application) => {
  // Register our service on the Feathers application
  app.use(deviceTypesPath, new DeviceTypesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceTypesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deviceTypesPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [deviceTypesPath]: DeviceTypesService
  }
}
