// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { DeviceTypeService, getOptions } from './devicetypes.class'
import { deviceTypePath, deviceTypeMethods } from './devicetypes.shared'
import hooks from './devicetypes.hooks'

export * from './devicetypes.class'
export * from './devicetypes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const deviceType = (app: Application) => {
  // Register our service on the Feathers application
  app.use(deviceTypePath, new DeviceTypeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceTypeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deviceTypePath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [deviceTypePath]: DeviceTypeService
  }
}
